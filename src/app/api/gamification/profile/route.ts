import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import GamificationSystem from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const learnerId = searchParams.get('learnerId')

    if (!learnerId) {
      return NextResponse.json(
        { error: 'learnerId is required' },
        { status: 400 }
      )
    }

    // Get or create gamification profile
    let profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
      include: {
        learner: true,
      },
    })

    if (!profile) {
      profile = await GamificationSystem.initializeProfile(learnerId)
    }

    // Update streak on page load
    await GamificationSystem.updateStreak(learnerId)

    // Get updated profile
    profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
      include: {
        learner: true,
        badges: {
          include: {
            badge: true,
          },
          orderBy: {
            earnedAt: 'desc',
          },
        },
      },
    })

    // Calculate XP progress
    const xpProgress = {
      level: profile!.level,
      currentXP: profile!.xp,
      xpToNextLevel: profile!.xpToNextLevel,
      progressPercentage: (profile!.xp / profile!.xpToNextLevel) * 100,
      totalXPEarned: profile!.totalXPEarned,
    }

    // Calculate hearts refill time
    let timeUntilRefill = null
    if (profile!.heartsRefillTime) {
      timeUntilRefill = Math.max(
        0,
        Math.floor((new Date(profile!.heartsRefillTime).getTime() - Date.now()) / 1000)
      )
    }

    // Update hearts if needed
    if (profile!.hearts < profile!.maxHearts) {
      const heartsInfo = await GamificationSystem.refillHearts(learnerId)
      profile = await db.gamificationProfile.findUnique({
        where: { learnerId },
      })
    }

    return NextResponse.json({
      xp: xpProgress,
      hearts: {
        currentHearts: profile!.hearts,
        maxHearts: profile!.maxHearts,
        timeUntilRefill,
      },
      streak: {
        currentStreak: profile!.currentStreak,
        longestStreak: profile!.longestStreak,
        streakBonusMultiplier: Math.min(
          2,
          1 + Math.floor(profile!.currentStreak / 7) * 0.1
        ),
        canMaintainToday: true, // Will be calculated properly
      },
      stats: {
        lessonsCompleted: profile!.lessonsCompleted,
        perfectLessons: profile!.perfectLessons,
        totalStudyMinutes: profile!.learner.totalStudyMinutes,
      },
      badges: profile!.badges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        nameAr: ub.badge.nameAr,
        description: ub.badge.description,
        descriptionAr: ub.badge.descriptionAr,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity,
        earned: true,
        earnedAt: ub.earnedAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching gamification profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
