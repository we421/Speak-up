'use client'

import { useState, useEffect } from 'react'
import { Target, CheckCircle, Circle, Gift, Clock, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DailyChallenge {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  type: string
  target: number
  xpReward: number
  gemsReward: number
  progress?: number
  completed?: boolean
  claimed?: boolean
}

interface DailyChallengesProps {
  challenges?: DailyChallenge[]
  onClaimReward?: (challengeId: string) => void
}

export default function DailyChallenges({
  challenges = [],
  onClaimReward,
}: DailyChallengesProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'COMPLETE_LESSONS':
        return '📚'
      case 'EARN_XP':
        return '⭐'
      case 'PERFECT_LESSONS':
        return '💎'
      case 'MAINTAIN_STREAK':
        return '🔥'
      case 'PRACTICE_SKILL':
        return '🎯'
      case 'SOCIAL_SHARE':
        return '📢'
      default:
        return '🎯'
    }
  }

  const completedCount = challenges.filter((c) => c.completed).length
  const totalCount = challenges.length
  const allCompleted = completedCount === totalCount && totalCount > 0

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-lg">Daily Challenges</CardTitle>
          </div>
          {allCompleted && (
            <Badge className="bg-green-500 hover:bg-green-600">All Done! 🎉</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Resets in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} / {totalCount}
            </span>
          </div>
          <Progress
            value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
            className="h-2"
          />
        </div>

        {/* Challenges List */}
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const progress = challenge.progress || 0
            const progressPercentage = Math.min(100, (progress / challenge.target) * 100)
            const isCompleted = challenge.completed || false
            const isClaimed = challenge.claimed || false

            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isClaimed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : isCompleted
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-2xl">
                    {isClaimed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-purple-500" />
                    ) : (
                      <span>{getChallengeIcon(challenge.type)}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {isClaimed ? 'Claimed!' : isCompleted ? 'Completed!' : challenge.titleAr}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {isClaimed
                            ? challenge.descriptionAr
                            : challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    {!isCompleted && !isClaimed && challenge.target > 1 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {progress} / {challenge.target}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-1.5" />
                      </div>
                    )}

                    {/* Rewards */}
                    <div className="flex items-center gap-3 mt-2">
                      {challenge.xpReward > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-medium text-yellow-700 dark:text-yellow-400">
                            +{challenge.xpReward} XP
                          </span>
                        </div>
                      )}
                      {challenge.gemsReward > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-purple-500">💎</span>
                          <span className="font-medium text-purple-700 dark:text-purple-400">
                            +{challenge.gemsReward} Gems
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Claim Button */}
                    {isCompleted && !isClaimed && onClaimReward && (
                      <Button
                        size="sm"
                        onClick={() => onClaimReward(challenge.id)}
                        className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Reward
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No daily challenges yet</p>
            <p className="text-sm">Check back tomorrow!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
