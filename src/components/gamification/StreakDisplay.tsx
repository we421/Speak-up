'use client'

import { Flame, Calendar, TrendingUp } from 'lucide-react'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  streakBonusMultiplier: number
  canMaintainToday: boolean
  showLongest?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StreakDisplay({
  currentStreak,
  longestStreak,
  streakBonusMultiplier,
  canMaintainToday,
  showLongest = true,
  size = 'md',
}: StreakDisplayProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg'
  const labelSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500'
    if (streak >= 14) return 'from-orange-500 to-red-500'
    if (streak >= 7) return 'from-yellow-500 to-orange-500'
    return 'from-blue-500 to-purple-500'
  }

  const streakGradient = getStreakColor(currentStreak)

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${streakGradient} p-4 rounded-xl text-white shadow-lg`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-white/10 animate-pulse" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center rounded-full bg-white/20 ${iconSize}`}
            >
              <Flame className="w-full h-full text-white fill-white/80" />
            </div>
            <div>
              <p className={`font-bold ${textSize}`}>{currentStreak}</p>
              <p className={`text-white/80 ${labelSize}`}>Day Streak</p>
            </div>
          </div>

          {streakBonusMultiplier > 1 && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span className={`font-bold ${labelSize}`}>x{streakBonusMultiplier.toFixed(1)}</span>
            </div>
          )}
        </div>

        {showLongest && longestStreak > 0 && (
          <div className="mt-3 flex items-center gap-1 text-white/90">
            <Calendar className={`w-3 h-3`} />
            <span className={`text-xs`}>
              Longest: <span className="font-bold">{longestStreak} days</span>
            </span>
          </div>
        )}

        {!canMaintainToday && currentStreak > 0 && (
          <div className="mt-2 text-xs text-yellow-200 font-medium">
            ⚠️ Complete a lesson today to maintain your streak!
          </div>
        )}
      </div>
    </div>
  )
}
