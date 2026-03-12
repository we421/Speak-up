// Leaderboard System - Competition that motivates!
import { db } from '@/lib/db'

interface LeaderboardEntry {
  rank: number
  learnerId: string
  name: string
  xp: number
  level: number
  streak: number
  lessons: number
}

interface LeaderboardStats {
  rank: number
  totalUsers: number
  topXP: number
  averageXP: number
}

export class LeaderboardSystem {
  // Update leaderboard entry
  static async updateEntry(
    learnerId: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME'
  ) {
    const profile = await db.gamificationProfile.findUnique({
      where: { learnerId },
      include: {
        learner: true,
      },
    })

    if (!profile) return null

    // Calculate date range
    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (period === 'DAILY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    } else if (period === 'WEEKLY') {
      const dayOfWeek = now.getDay()
      startDate = new Date(now)
      startDate.setDate(now.getDate() - dayOfWeek)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)
    } else if (period === 'MONTHLY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else {
      startDate = new Date(0) // Beginning of time
      endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // Far future
    }

    // Upsert entry
    return db.leaderboardEntry.upsert({
      where: {
        id: `${learnerId}-${period}-${startDate.getTime()}`,
      },
      update: {
        xp: profile.totalXPEarned,
        level: profile.level,
        streak: profile.currentStreak,
        lessons: profile.lessonsCompleted,
        updatedAt: new Date(),
      },
      create: {
        id: `${learnerId}-${period}-${startDate.getTime()}`,
        learnerId,
        xp: profile.totalXPEarned,
        level: profile.level,
        streak: profile.currentStreak,
        lessons: profile.lessonsCompleted,
        period,
        startDate,
        endDate,
      },
    })
  }

  // Get leaderboard
  static async getLeaderboard(
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME',
    limit: number = 50
  ): Promise<LeaderboardEntry[]> {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (period === 'DAILY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    } else if (period === 'WEEKLY') {
      const dayOfWeek = now.getDay()
      startDate = new Date(now)
      startDate.setDate(now.getDate() - dayOfWeek)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)
    } else if (period === 'MONTHLY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else {
      startDate = new Date(0)
      endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    }

    const entries = await db.leaderboardEntry.findMany({
      where: {
        period,
        startDate: { gte: startDate },
        endDate: { lte: endDate },
      },
      include: {
        learner: true,
      },
      orderBy: {
        xp: 'desc',
      },
      take: limit,
    })

    // Add ranks
    return entries.map((entry, index) => ({
      rank: index + 1,
      learnerId: entry.learnerId,
      name: entry.learner.name,
      xp: entry.xp,
      level: entry.level,
      streak: entry.streak,
      lessons: entry.lessons,
    }))
  }

  // Get user's leaderboard position
  static async getUserPosition(
    learnerId: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME'
  ): Promise<LeaderboardStats | null> {
    const leaderboard = await this.getLeaderboard(period, 1000)

    const userEntry = leaderboard.find((entry) => entry.learnerId === learnerId)

    if (!userEntry) return null

    const totalXP = leaderboard.reduce((sum, entry) => sum + entry.xp, 0)
    const averageXP = totalXP / leaderboard.length

    return {
      rank: userEntry.rank,
      totalUsers: leaderboard.length,
      topXP: leaderboard[0]?.xp || 0,
      averageXP: Math.round(averageXP),
    }
  }

  // Get top learners
  static async getTopLearners(
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME',
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard(period, limit)
  }

  // Get friends leaderboard
  static async getFriendsLeaderboard(learnerId: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME') {
    // Get accepted friends
    const friends = await db.friend.findMany({
      where: {
        OR: [
          { senderId: learnerId, status: 'ACCEPTED' },
          { receiverId: learnerId, status: 'ACCEPTED' },
        ],
      },
    })

    const friendIds = friends.map((f) => (f.senderId === learnerId ? f.receiverId : f.senderId))

    // Get leaderboard entries for friends
    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (period === 'DAILY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    } else if (period === 'WEEKLY') {
      const dayOfWeek = now.getDay()
      startDate = new Date(now)
      startDate.setDate(now.getDate() - dayOfWeek)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)
    } else if (period === 'MONTHLY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else {
      startDate = new Date(0)
      endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    }

    const entries = await db.leaderboardEntry.findMany({
      where: {
        learnerId: { in: friendIds },
        period,
        startDate: { gte: startDate },
        endDate: { lte: endDate },
      },
      include: {
        learner: true,
      },
      orderBy: {
        xp: 'desc',
      },
    })

    // Add user's own entry
    const userEntry = await db.leaderboardEntry.findFirst({
      where: {
        learnerId,
        period,
        startDate: { gte: startDate },
        endDate: { lte: endDate },
      },
      include: {
        learner: true,
      },
    })

    if (userEntry) {
      entries.push(userEntry)
    }

    // Sort and add ranks
    const sorted = entries.sort((a, b) => b.xp - a.xp)

    return sorted.map((entry, index) => ({
      rank: index + 1,
      learnerId: entry.learnerId,
      name: entry.learner.name,
      xp: entry.xp,
      level: entry.level,
      streak: entry.streak,
      lessons: entry.lessons,
      isCurrentUser: entry.learnerId === learnerId,
    }))
  }
}

export default LeaderboardSystem
