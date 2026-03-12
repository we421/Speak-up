'use client'

import { Progress } from '@/components/ui/progress'
import { Trophy, Star } from 'lucide-react'

interface XPBarProps {
  level: number
  currentXP: number
  xpToNextLevel: number
  progressPercentage: number
  showLevel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function XPBar({
  level,
  currentXP,
  xpToNextLevel,
  progressPercentage,
  showLevel = true,
  size = 'md',
}: XPBarProps) {
  const height = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'

  return (
    <div className="w-full">
      {showLevel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
              {level}
            </div>
            <span className={`font-semibold ${textSize} text-gray-700 dark:text-gray-200`}>
              Level {level}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className={`font-bold ${textSize} text-yellow-600 dark:text-yellow-400`}>
              {currentXP} / {xpToNextLevel} XP
            </span>
          </div>
        </div>
      )}
      <div className="relative">
        <Progress
          value={progressPercentage}
          className={`w-full ${height} bg-gray-200 dark:bg-gray-700`}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Trophy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <p className={`mt-1 text-center text-xs text-gray-500 dark:text-gray-400`}>
        {progressPercentage.toFixed(0)}% to next level
      </p>
    </div>
  )
}
