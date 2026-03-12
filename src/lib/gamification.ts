// Gamification System - Better than Duolingo!
import { db } from '@/lib/db'

interface XPProgress {
  currentLevel: number
  currentXP: number
  xpToNextLevel: number
  progressPercentage: number
  totalXPEarned: number
}

interface StreakInfo {
  currentStreak: number
  longestStreak: number
  lastActiveDate: Date | null
  streakBonusMultiplier: number
  canMaintainToday: boolean
}

interface HeartsInfo {
  currentHearts: number
  maxHearts: number
  heartsRefillTime: Date | null
  timeUntilRefill: number | null // seconds
  canRefillNow: boolean
}

export class GamificationSystem {
  // Calculate XP needed for a level (exponential curve)
  static getXPForLevel(level: number): number {
    // Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, etc.
    // Formula: 100 * (level - 1) + 50 * (level - 1) * (level - 2) / 2
    return 100 * (level - 1) + 50 * (level - 1) * (level - 2) / 2
  }

  // Calculate total XP needed to reach a level
  static getXPReward(action: string, difficulty: number = 1, score: number = 100): number {
    const baseXP = {
      lesson_complete: 10,
      perfect_lesson: 20,
      exercise_complete: 5,
      streak_maintain: 5,
      daily_challenge: 15,
      new_badge: 25,
      pronunciation_perfect: 10,
      reading_complete: 8,
      writing_complete: 8,
      listening_complete: 8,
    }

    const base = baseXP[action as keyof typeof baseXP] || 5
    const difficultyMultiplier = 1 + (difficulty - 1) * 0.2
    const scoreMultiplier = score / 100

    return Math.round(base * difficultyMultiplier * scoreMultiplier)
  }

  // Add XP to learner
  static async addXP(learnerId: string, xp: number): Promise<XPProgress> {
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
    })

    if (!profile) {
      // Create profile if it doesn't exist
      await db.gamificationProfile.create({
        data: {
          learnerId,
          xp,
          totalXPEarned: xp,
          xpToNextLevel: this.getXPForLevel(2),
        },
      })
      return {
        currentLevel: 1,
        currentXP: xp,
        xpToNextLevel: this.getXPForLevel(2),
        progressPercentage: Math.min(100, (xp / this.getXPForLevel(2)) * 100),
        totalXPEarned: xp,
      }
    }

    const newTotalXP = profile.xp + xp
    const newTotalEarned = profile.totalXPEarned + xp

    // Calculate new level
    let newLevel = profile.level
    let xpToNext = profile.xpToNextLevel

    while (newTotalXP >= xpToNext && newLevel < 50) {
      newLevel++
      xpToNext = this.getXPForLevel(newLevel + 1)
    }

    // Update profile
    const updated = await db.gamificationProfile.update({
      where: { learnerId },
      data: {
        xp: newTotalXP,
        level: newLevel,
        xpToNextLevel: xpToNext,
        totalXPEarned: newTotalEarned,
      },
    })

    const progressPercentage = (updated.xp / updated.xpToNextLevel) * 100

    return {
      currentLevel: updated.level,
      currentXP: updated.xp,
      xpToNextLevel: updated.xpToNextLevel,
      progressPercentage: Math.min(100, progressPercentage),
      totalXPEarned: updated.totalXPEarned,
    }
  }

  // Update streak
  static async updateStreak(learnerId: string): Promise<StreakInfo> {
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
    })

    if (!profile) {
      await db.gamificationProfile.create({
        data: {
          learnerId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: new Date(),
        },
      })

      // Create streak history
      await db.streakHistory.create({
        data: {
          profileId: (await db.gamificationProfile.findUnique({ where: { learnerId } }))!.id,
          streakCount: 1,
          isStreakMaintained: true,
        },
      })

      return {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: new Date(),
        streakBonusMultiplier: 1,
        canMaintainToday: true,
      }
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate) : null
    const lastActiveDay = lastActive ? new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()) : null

    let newStreak = profile.currentStreak
    let newLongest = profile.longestStreak
    let isStreakMaintained = false

    if (!lastActiveDay) {
      // First activity
      newStreak = 1
      isStreakMaintained = true
    } else {
      const daysDiff = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        // Already active today
        isStreakMaintained = true
      } else if (daysDiff === 1) {
        // Next day - maintain streak
        newStreak++
        isStreakMaintained = true
      } else {
        // Streak broken
        newStreak = 1
        isStreakMaintained = false
      }
    }

    // Update longest streak
    if (newStreak > newLongest) {
      newLongest = newStreak
    }

    // Update profile
    await db.gamificationProfile.update({
      where: { learnerId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: now,
      },
    })

    // Create streak history
    await db.streakHistory.create({
      data: {
        profileId: profile.id,
        streakCount: newStreak,
        isStreakMaintained,
      },
    })

    // Calculate streak bonus (1x base, +0.1x per 7 days, max 2x)
    const streakBonusMultiplier = Math.min(2, 1 + Math.floor(newStreak / 7) * 0.1)

    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: now,
      streakBonusMultiplier,
      canMaintainToday: daysDiff === 0,
    }
  }

  // Use a heart
  static async useHeart(learnerId: string): Promise<HeartsInfo | null> {
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
    })

    if (!profile || profile.hearts <= 0) {
      return null
    }

    const newHearts = profile.hearts - 1

    // Update profile
    await db.gamificationProfile.update({
      where: { learnerId },
      data: {
        hearts: newHearts,
      },
    })

    return {
      currentHearts: newHearts,
      maxHearts: profile.maxHearts,
      heartsRefillTime: profile.heartsRefillTime,
      timeUntilRefill: profile.heartsRefillTime
        ? Math.max(0, Math.floor((new Date(profile.heartsRefillTime).getTime() - Date.now()) / 1000))
        : null,
      canRefillNow: newHearts < profile.maxHearts,
    }
  }

  // Refill hearts
  static async refillHearts(learnerId: string): Promise<HeartsInfo> {
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
    })

    if (!profile) {
      return {
        currentHearts: 5,
        maxHearts: 5,
        heartsRefillTime: null,
        timeUntilRefill: null,
        canRefillNow: false,
      }
    }

    const now = new Date()

    // Check if it's time to refill (every 30 minutes for 1 heart)
    if (profile.heartsRefillTime && new Date(profile.heartsRefillTime) <= now) {
      const heartsToAdd = 1
      const newHearts = Math.min(profile.maxHearts, profile.hearts + heartsToAdd)

      const updated = await db.gamificationProfile.update({
        where: { learnerId },
        data: {
          hearts: newHearts,
          heartsRefillTime: newHearts < profile.maxHearts
            ? new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes
            : null,
        },
      })

      return {
        currentHearts: updated.hearts,
        maxHearts: updated.maxHearts,
        heartsRefillTime: updated.heartsRefillTime,
        timeUntilRefill: updated.heartsRefillTime
          ? Math.floor((new Date(updated.heartsRefillTime).getTime() - Date.now()) / 1000)
          : null,
        canRefillNow: updated.hearts < updated.maxHearts,
      }
    }

    return {
      currentHearts: profile.hearts,
      maxHearts: profile.maxHearts,
      heartsRefillTime: profile.heartsRefillTime,
      timeUntilRefill: profile.heartsRefillTime
        ? Math.floor((new Date(profile.heartsRefillTime).getTime() - Date.now()) / 1000)
        : null,
      canRefillNow: profile.hearts < profile.maxHearts,
    }
  }

  // Get complete gamification profile
  static async getProfile(learnerId: string) {
    return db.gamificationProfile.findUnique({
      where: { learnerId },
      include: {
        streakHistory: {
          orderBy: { date: 'desc' },
          take: 7,
        },
      },
    })
  }

  // Initialize gamification profile for a new learner
  static async initializeProfile(learnerId: string) {
    return db.gamificationProfile.create({
      data: {
        learnerId,
        xp: 0,
        level: 1,
        xpToNextLevel: this.getXPForLevel(2),
        currentStreak: 0,
        longestStreak: 0,
        hearts: 5,
        maxHearts: 5,
        gems: 50, // Start with 50 gems as welcome bonus
      },
    })
  }

  // Complete a lesson
  static async completeLesson(
    learnerId: string,
    lessonId: string,
    score: number,
    isPerfect: boolean
  ) {
    // Update or create user lesson
    const userLesson = await db.userLesson.upsert({
      where: {
        learnerId_lessonId: {
          learnerId,
          lessonId,
        },
      },
      update: {
        completed: true,
        score,
        bestScore: (existing) => Math.max(existing.bestScore || 0, score),
        attempts: { increment: 1 },
        xpEarned: this.getXPReward('lesson_complete', 1, score),
        completedAt: new Date(),
        lastAttemptAt: new Date(),
      },
      create: {
        learnerId,
        lessonId,
        completed: true,
        score,
        bestScore: score,
        attempts: 1,
        xpEarned: this.getXPReward('lesson_complete', 1, score),
        completedAt: new Date(),
      },
    })

    // Add XP
    const xpReward = this.getXPReward(isPerfect ? 'perfect_lesson' : 'lesson_complete', 1, score)
    await this.addXP(learnerId, xpReward)

    // Update streak
    await this.updateStreak(learnerId)

    // Update profile
    await db.gamificationProfile.update({
      where: { learnerId },
      data: {
        lessonsCompleted: { increment: 1 },
        perfectLessons: isPerfect ? { increment: 1 } : undefined,
      },
    })

    return userLesson
  }

  // Check and award badges
  static async checkBadges(learnerId: string) {
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
      },
    })

    if (!profile) return []

    const earnedBadgeIds = profile.badges.map((b) => b.badgeId)
    const allBadges = await db.badge.findMany()

    const newBadges: any[] = []

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue

      const requirement = JSON.parse(badge.requirement)
      let shouldAward = false

      // Check badge requirements
      if (badge.category === 'STREAK') {
        shouldAward = profile.currentStreak >= requirement.streak
      } else if (badge.category === 'LESSONS') {
        shouldAward = profile.lessonsCompleted >= requirement.lessons
      } else if (badge.category === 'SKILLS') {
        shouldAward = profile.perfectLessons >= requirement.perfectLessons
      }

      if (shouldAward) {
        await db.userBadge.create({
          data: {
            learnerId,
            badgeId: badge.id,
            earnedAt: new Date(),
            progress: 1,
            maxProgress: 1,
          },
        })

        // Award badge rewards
        await this.addXP(learnerId, badge.xpReward)

        newBadges.push(badge)
      }
    }

    return newBadges
  }
}

export default GamificationSystem
