'use client'

import { Progress } from '@/components/ui/progress'
import { Lock, Unlock, Award } from 'lucide-react'

interface BadgeCardProps {
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  earned: boolean
  progress?: number
  maxProgress?: number
}

export default function BadgeCard({
  name,
  nameAr,
  description,
  descriptionAr,
  icon,
  rarity,
  earned,
  progress = 0,
  maxProgress = 1,
}: BadgeCardProps) {
  const rarityColors = {
    COMMON: 'from-gray-400 to-gray-500 border-gray-400',
    RARE: 'from-blue-400 to-blue-600 border-blue-500',
    EPIC: 'from-purple-400 to-purple-600 border-purple-500',
    LEGENDARY: 'from-yellow-400 to-orange-500 border-yellow-500',
  }

  const rarityBackgrounds = {
    COMMON: 'bg-gray-100 dark:bg-gray-800',
    RARE: 'bg-blue-100 dark:bg-blue-900/20',
    EPIC: 'bg-purple-100 dark:bg-purple-900/20',
    LEGENDARY: 'bg-yellow-100 dark:bg-yellow-900/20',
  }

  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0

  return (
    <div
      className={`relative group p-4 rounded-xl border-2 transition-all duration-300 ${
        earned
          ? `bg-gradient-to-br ${rarityColors[rarity]} text-white shadow-lg`
          : `${rarityBackgrounds[rarity]} border-gray-300 dark:border-gray-700 opacity-70`
      } hover:scale-105 hover:shadow-xl`}
    >
      {/* Badge icon */}
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3">
        <span className="text-4xl">{earned ? icon : '🔒'}</span>
      </div>

      {/* Badge info */}
      <div className="text-center">
        <h3 className="font-bold text-sm mb-1">{earned ? name : '???'}</h3>
        {!earned && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{nameAr}</p>
        )}
        <p className={`text-xs ${earned ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
          {earned ? description : descriptionAr}
        </p>
      </div>

      {/* Progress bar for unearned badges */}
      {!earned && maxProgress > 1 && (
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
            {progress} / {maxProgress}
          </p>
        </div>
      )}

      {/* Rarity badge */}
      <div className="absolute top-2 right-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            earned
              ? 'bg-white/20 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          {rarity}
        </span>
      </div>

      {/* Earned indicator */}
      {earned && (
        <div className="absolute -top-1 -right-1">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  )
}
