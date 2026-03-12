'use client'

import { Lock, CheckCircle, Star, Sparkles, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface LessonCardProps {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  xpReward: number
  gemReward: number
  isLocked: boolean
  isCompleted?: boolean
  isBonus?: boolean
  score?: number
  onClick?: () => void
}

export default function LessonCard({
  id,
  title,
  titleAr,
  description,
  descriptionAr,
  xpReward,
  gemReward,
  isLocked,
  isCompleted = false,
  isBonus = false,
  score,
  onClick,
}: LessonCardProps) {
  return (
    <Card
      onClick={isLocked ? undefined : onClick}
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
        ${isCompleted ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-700' : ''}
        ${isBonus ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-300 dark:border-purple-700' : ''}
        ${!isLocked && !isCompleted && !isBonus ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : ''}
      `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      {/* Content */}
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isLocked ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
                <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            ) : isCompleted ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            ) : isBonus ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                <Target className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {isCompleted && score !== undefined && (
            <div className="flex items-center gap-1 text-sm font-bold text-green-600 dark:text-green-400">
              <Star className="w-4 h-4 fill-current" />
              <span>{score}%</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {isLocked ? '???' : title}
          </h3>
          {!isLocked && (
            <p className="text-xs text-gray-600 dark:text-gray-400">{titleAr}</p>
          )}
        </div>

        {/* Description */}
        {!isLocked && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rewards */}
        <div className="flex items-center gap-3 text-xs">
          {xpReward > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="font-medium text-yellow-700 dark:text-yellow-400">
                +{xpReward} XP
              </span>
            </div>
          )}
          {gemReward > 0 && (
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span className="font-medium text-purple-700 dark:text-purple-400">
                +{gemReward} 💎
              </span>
            </div>
          )}
        </div>

        {/* Bonus indicator */}
        {isBonus && !isLocked && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              BONUS
            </span>
          </div>
        )}
      </div>

      {/* Completed glow effect */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent" />
        </div>
      )}
    </Card>
  )
}
