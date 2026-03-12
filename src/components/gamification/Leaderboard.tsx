'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Crown, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LeaderboardEntry {
  rank: number
  learnerId: string
  name: string
  xp: number
  level: number
  streak: number
  lessons: number
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  initialData?: LeaderboardEntry[]
  userPosition?: number
  showTabs?: boolean
}

export default function Leaderboard({
  initialData = [],
  userPosition,
  showTabs = true,
}: LeaderboardProps) {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'>('WEEKLY')
  const [data, setData] = useState<LeaderboardEntry[]>(initialData)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />
    return <span className="font-bold text-gray-500">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
    if (rank === 2) return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
    if (rank === 3) return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
    return ''
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <CardTitle>Leaderboard</CardTitle>
          </div>
          {userPosition && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Your Rank: #{userPosition}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {showTabs && (
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="DAILY">Daily</TabsTrigger>
              <TabsTrigger value="WEEKLY">Weekly</TabsTrigger>
              <TabsTrigger value="MONTHLY">Monthly</TabsTrigger>
              <TabsTrigger value="ALL_TIME">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="space-y-2">
          {data.map((entry) => (
            <div
              key={entry.learnerId}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700 shadow-md'
                  : getRankColor(entry.rank) || 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-10 h-10">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                  {entry.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{entry.name}</p>
                  {entry.isCurrentUser && (
                    <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Level {entry.level}
                  </span>
                  <span className="flex items-center gap-1">
                    🔥 {entry.streak} streak
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-bold text-sm text-yellow-600 dark:text-yellow-400">
                  {entry.xp.toLocaleString()} XP
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.lessons} lessons
                </p>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No leaderboard data yet</p>
            <p className="text-sm">Complete lessons to appear here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
