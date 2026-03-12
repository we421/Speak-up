import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import GamificationSystem from '@/lib/gamification'
import BadgeSystem from '@/lib/badges'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { learnerId, lessonId, score, isPerfect } = body

    if (!learnerId || !lessonId || score === undefined) {
      return NextResponse.json(
        { error: 'learnerId, lessonId, and score are required' },
        { status: 400 }
      )
    }

    // Complete the lesson
    const userLesson = await GamificationSystem.completeLesson(
      learnerId,
      lessonId,
      score,
      isPerfect || false
    )

    // Check for new badges
    const newBadges = await GamificationSystem.checkBadges(learnerId)

    // Get updated profile
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
    })

    // Get updated badges
    const userBadges = await db.userBadge.findMany({
      where: { learnerId },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      userLesson,
      xpEarned: userLesson.xpEarned,
      newBadges,
      updatedProfile: {
        level: profile!.level,
        xp: profile!.xp,
        streak: profile!.currentStreak,
        hearts: profile!.hearts,
      },
      allBadges: userBadges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        nameAr: ub.badge.nameAr,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity,
        earned: true,
      })),
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    )
  }
}
