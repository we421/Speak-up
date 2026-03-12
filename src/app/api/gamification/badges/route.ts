import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import BadgeSystem from '@/lib/badges'
import GamificationSystem from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const learnerId = searchParams.get('learnerId')
    const category = searchParams.get('category')
    const rarity = searchParams.get('rarity')

    // Initialize badges if needed
    await BadgeSystem.initializeBadges()

    if (learnerId) {
      // Get user's badges with progress
      const userBadges = await BadgeSystem.getUserBadges(learnerId)
      const allBadges = await BadgeSystem.getAllBadges()

      const badgesWithProgress = await Promise.all(
        allBadges.map(async (badge) => {
          const progress = await BadgeSystem.getBadgeProgress(learnerId, badge.id)
          return {
            ...badge,
            earned: progress?.earned || false,
            progress: progress?.progress || 0,
            maxProgress: progress?.maxProgress || 1,
            percentage: progress?.percentage || 0,
          }
        })
      )

      return NextResponse.json({
        userBadges,
        allBadges: badgesWithProgress,
      })
    } else {
      // Get all badges (for public view)
      let badges = await BadgeSystem.getAllBadges()

      if (category) {
        badges = badges.filter((b) => b.category === category)
      }

      if (rarity) {
        badges = badges.filter((b) => b.rarity === rarity)
      }

      return NextResponse.json({
        badges,
      })
    }
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
}
