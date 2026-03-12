'use client'

import { Heart, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface HeartsDisplayProps {
  currentHearts: number
  maxHearts: number
  timeUntilRefill: number | null
  onRefill?: () => void
  showRefillButton?: boolean
}

export default function HeartsDisplay({
  currentHearts,
  maxHearts,
  timeUntilRefill,
  onRefill,
  showRefillButton = true,
}: HeartsDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(timeUntilRefill)

  useEffect(() => {
    setTimeLeft(timeUntilRefill)
  }, [timeUntilRefill])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 0) {
          return prev - 1
        }
        return 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isFull = currentHearts >= maxHearts
  const isEmpty = currentHearts <= 0

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 transition-all ${
              i < currentHearts
                ? 'text-red-500 fill-red-500 animate-pulse'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {isFull ? 'Full Hearts!' : `${currentHearts} / ${maxHearts} Hearts`}
        </p>
        {timeLeft !== null && timeLeft > 0 && !isFull && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Next heart in {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {showRefillButton && !isFull && onRefill && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefill}
          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <Plus className="w-4 h-4 text-red-500" />
        </Button>
      )}
    </div>
  )
}
