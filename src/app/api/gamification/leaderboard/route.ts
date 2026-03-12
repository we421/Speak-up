import { NextRequest, NextResponse } from 'next/server'
import LeaderboardSystem from '@/lib/leaderboard'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const learnerId = searchParams.get('learnerId')
    const period = (searchParams.get('period') as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME') || 'ALL_TIME'
    const limit = parseInt(searchParams.get('limit') || '50')
    const friendsOnly = searchParams.get('friendsOnly') === 'true'

    let leaderboard
    let userPosition = null

    if (friendsOnly && learnerId) {
      // Get friends leaderboard
      leaderboard = await LeaderboardSystem.getFriendsLeaderboard(learnerId, period)
    } else {
      // Get global leaderboard
      leaderboard = await LeaderboardSystem.getLeaderboard(period, limit)

      // Get user's position
      if (learnerId) {
        const position = await LeaderboardSystem.getUserPosition(learnerId, period)
        userPosition = position?.rank || null
      }
    }

    return NextResponse.json({
      leaderboard,
      userPosition,
      period,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { learnerId, period = 'ALL_TIME' } = body

    if (!learnerId) {
      return NextResponse.json(
        { error: 'learnerId is required' },
        { status: 400 }
      )
    }

    // Update user's leaderboard entry
    const entry = await LeaderboardSystem.updateEntry(learnerId, period)

    return NextResponse.json({
      success: true,
      entry,
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to update leaderboard' },
      { status: 500 }
    )
  }
}
