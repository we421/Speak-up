// Badge System - Achievements that motivate users!
import { db } from '@/lib/db'

interface BadgeData {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  category: string
  rarity: string
  xpReward: number
  gemsReward: number
}

export class BadgeSystem {
  // Initialize default badges
  static async initializeBadges() {
    const badges = [
      // Streak badges
      {
        name: 'First Steps',
        nameAr: 'الخطوات الأولى',
        description: 'Start your learning journey',
        descriptionAr: 'ابدأ رحلة التعلم الخاصة بك',
        icon: '🌟',
        category: 'STREAK',
        rarity: 'COMMON',
        xpReward: 10,
        gemsReward: 5,
        requirement: JSON.stringify({ streak: 1 }),
      },
      {
        name: 'Week Warrior',
        nameAr: 'محارب الأسبوع',
        description: 'Maintain a 7-day streak',
        descriptionAr: 'حافظ على استمرار لمدة 7 أيام',
        icon: '🔥',
        category: 'STREAK',
        rarity: 'RARE',
        xpReward: 50,
        gemsReward: 25,
        requirement: JSON.stringify({ streak: 7 }),
      },
      {
        name: 'Month Master',
        nameAr: 'سيد الشهر',
        description: 'Maintain a 30-day streak',
        descriptionAr: 'حافظ على استمرار لمدة 30 يوم',
        icon: '⚡',
        category: 'STREAK',
        rarity: 'EPIC',
        xpReward: 200,
        gemsReward: 100,
        requirement: JSON.stringify({ streak: 30 }),
      },
      {
        name: 'Year Champion',
        nameAr: 'بطل العام',
        description: 'Maintain a 365-day streak',
        descriptionAr: 'حافظ على استمرار لمدة 365 يوم',
        icon: '👑',
        category: 'STREAK',
        rarity: 'LEGENDARY',
        xpReward: 1000,
        gemsReward: 500,
        requirement: JSON.stringify({ streak: 365 }),
      },

      // Lesson badges
      {
        name: 'First Lesson',
        nameAr: 'أول درس',
        description: 'Complete your first lesson',
        descriptionAr: 'أكمل أول درس لك',
        icon: '📚',
        category: 'LESSONS',
        rarity: 'COMMON',
        xpReward: 10,
        gemsReward: 5,
        requirement: JSON.stringify({ lessons: 1 }),
      },
      {
        name: 'Ten Lessons',
        nameAr: 'عشرة دروس',
        description: 'Complete 10 lessons',
        descriptionAr: 'أكمل 10 دروس',
        icon: '📖',
        category: 'LESSONS',
        rarity: 'COMMON',
        xpReward: 25,
        gemsReward: 10,
        requirement: JSON.stringify({ lessons: 10 }),
      },
      {
        name: 'Lesson Scholar',
        nameAr: 'عالم الدروس',
        description: 'Complete 50 lessons',
        descriptionAr: 'أكمل 50 درس',
        icon: '🎓',
        category: 'LESSONS',
        rarity: 'RARE',
        xpReward: 100,
        gemsReward: 50,
        requirement: JSON.stringify({ lessons: 50 }),
      },
      {
        name: 'Lesson Master',
        nameAr: 'سيد الدروس',
        description: 'Complete 100 lessons',
        descriptionAr: 'أكمل 100 درس',
        icon: '🏆',
        category: 'LESSONS',
        rarity: 'EPIC',
        xpReward: 250,
        gemsReward: 125,
        requirement: JSON.stringify({ lessons: 100 }),
      },

      // Perfect lesson badges
      {
        name: 'Perfect Start',
        nameAr: 'بداية مثالية',
        description: 'Complete a lesson with 100% score',
        descriptionAr: 'أكمل درساً بنتيجة 100%',
        icon: '💎',
        category: 'SKILLS',
        rarity: 'COMMON',
        xpReward: 15,
        gemsReward: 10,
        requirement: JSON.stringify({ perfectLessons: 1 }),
      },
      {
        name: 'Perfectionist',
        nameAr: 'المثالي',
        description: 'Complete 10 lessons perfectly',
        descriptionAr: 'أكمل 10 دروس بشكل مثالي',
        icon: '✨',
        category: 'SKILLS',
        rarity: 'RARE',
        xpReward: 75,
        gemsReward: 35,
        requirement: JSON.stringify({ perfectLessons: 10 }),
      },
      {
        name: 'Flawless',
        nameAr: 'خالٍ من العيوب',
        description: 'Complete 50 lessons perfectly',
        descriptionAr: 'أكمل 50 درس بشكل مثالي',
        icon: '🌟',
        category: 'SKILLS',
        rarity: 'EPIC',
        xpReward: 300,
        gemsReward: 150,
        requirement: JSON.stringify({ perfectLessons: 50 }),
      },

      // Special badges
      {
        name: 'Early Bird',
        nameAr: 'الطائر المبكر',
        description: 'Study before 8 AM',
        descriptionAr: 'ادرس قبل الثامنة صباحاً',
        icon: '🐦',
        category: 'SPECIAL',
        rarity: 'COMMON',
        xpReward: 20,
        gemsReward: 10,
        requirement: JSON.stringify({ special: 'early_bird' }),
      },
      {
        name: 'Night Owl',
        nameAr: 'بومة الليل',
        description: 'Study after 10 PM',
        descriptionAr: 'ادرس بعد العاشرة مساءً',
        icon: '🦉',
        category: 'SPECIAL',
        rarity: 'COMMON',
        xpReward: 20,
        gemsReward: 10,
        requirement: JSON.stringify({ special: 'night_owl' }),
      },
    ]

    // Create badges that don't exist
    for (const badgeData of badges) {
      await db.badge.upsert({
        where: { id: badgeData.name.toLowerCase().replace(/\s+/g, '_') },
        update: {},
        create: {
          id: badgeData.name.toLowerCase().replace(/\s+/g, '_'),
          ...badgeData,
        },
      })
    }

    return badges.length
  }

  // Get all badges
  static async getAllBadges(): Promise<BadgeData[]> {
    const badges = await db.badge.findMany()
    return badges
  }

  // Get user's badges
  static async getUserBadges(learnerId: string) {
    return db.userBadge.findMany({
      where: { learnerId },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: 'desc',
      },
    })
  }

  // Get badge progress for a user
  static async getBadgeProgress(learnerId: string, badgeId: string) {
    const userBadge = await db.userBadge.findUnique({
      where: {
        learnerId_badgeId: {
          learnerId,
          badgeId,
        },
      },
    })

    if (!userBadge) {
      const badge = await db.badge.findUnique({
        where: { id: badgeId },
      })

      if (!badge) return null

      const requirement = JSON.parse(badge.requirement)
      const profile = await db.gamificationProfile.findUnique({
        where: { learnerId },
      })

      if (!profile) return null

      let progress = 0
      let maxProgress = 1

      if (badge.category === 'STREAK') {
        progress = profile.currentStreak
        maxProgress = requirement.streak
      } else if (badge.category === 'LESSONS') {
        progress = profile.lessonsCompleted
        maxProgress = requirement.lessons
      } else if (badge.category === 'SKILLS') {
        progress = profile.perfectLessons
        maxProgress = requirement.perfectLessons
      }

      return {
        earned: false,
        progress,
        maxProgress,
        percentage: Math.min(100, (progress / maxProgress) * 100),
      }
    }

    return {
      earned: true,
      progress: userBadge.progress,
      maxProgress: userBadge.maxProgress,
      percentage: 100,
    }
  }

  // Award a badge to a user
  static async awardBadge(learnerId: string, badgeId: string) {
    return db.userBadge.create({
      data: {
        learnerId,
        badgeId,
        earnedAt: new Date(),
        progress: 1,
        maxProgress: 1,
      },
    })
  }

  // Get badges by category
  static async getBadgesByCategory(category: string) {
    return db.badge.findMany({
      where: { category: category as any },
    })
  }

  // Get badges by rarity
  static async getBadgesByRarity(rarity: string) {
    return db.badge.findMany({
      where: { rarity: rarity as any },
    })
  }
}

export default BadgeSystem
