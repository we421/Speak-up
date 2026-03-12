'use client'

import { useState, useEffect } from 'react'
import { Trophy, Award, Target, TrendingUp, Zap, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import XPBar from './XPBar'
import HeartsDisplay from './HeartsDisplay'
import StreakDisplay from './StreakDisplay'
import Leaderboard from './Leaderboard'
import DailyChallenges from './DailyChallenges'
import BadgeCard from './BadgeCard'

interface GamificationData {
  xp: {
    level: number
    currentXP: number
    xpToNextLevel: number
    progressPercentage: number
    totalXPEarned: number
  }
  hearts: {
    currentHearts: number
    maxHearts: number
    timeUntilRefill: number | null
  }
  streak: {
    currentStreak: number
    longestStreak: number
    streakBonusMultiplier: number
    canMaintainToday: boolean
  }
  stats: {
    lessonsCompleted: number
    perfectLessons: number
    totalStudyMinutes: number
  }
}

interface Badge {
  id: string
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

interface GamificationDashboardProps {
  data?: GamificationData
  badges?: Badge[]
  leaderboardData?: any[]
  dailyChallenges?: any[]
  onRefillHearts?: () => void
  onClaimChallenge?: (challengeId: string) => void
}

export default function GamificationDashboard({
  data,
  badges = [],
  leaderboardData = [],
  dailyChallenges = [],
  onRefillHearts,
  onClaimChallenge,
}: GamificationDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Default data if not provided
  const gamificationData = data || {
    xp: {
      level: 1,
      currentXP: 0,
      xpToNextLevel: 100,
      progressPercentage: 0,
      totalXPEarned: 0,
    },
    hearts: {
      currentHearts: 5,
      maxHearts: 5,
      timeUntilRefill: null,
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      streakBonusMultiplier: 1,
      canMaintainToday: true,
    },
    stats: {
      lessonsCompleted: 0,
      perfectLessons: 0,
      totalStudyMinutes: 0,
    },
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Learning Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress, earn rewards, and compete with friends!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {gamificationData.xp.level}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {gamificationData.streak.currentStreak}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {gamificationData.stats.lessonsCompleted}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {badges.filter((b) => b.earned).length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Bar */}
      <XPBar
        level={gamificationData.xp.level}
        currentXP={gamificationData.xp.currentXP}
        xpToNextLevel={gamificationData.xp.xpToNextLevel}
        progressPercentage={gamificationData.xp.progressPercentage}
      />

      {/* Hearts and Streak */}
      <div className="grid md:grid-cols-2 gap-4">
        <HeartsDisplay
          currentHearts={gamificationData.hearts.currentHearts}
          maxHearts={gamificationData.hearts.maxHearts}
          timeUntilRefill={gamificationData.hearts.timeUntilRefill}
          onRefill={onRefillHearts}
        />
        <StreakDisplay
          currentStreak={gamificationData.streak.currentStreak}
          longestStreak={gamificationData.streak.longestStreak}
          streakBonusMultiplier={gamificationData.streak.streakBonusMultiplier}
          canMaintainToday={gamificationData.streak.canMaintainToday}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Award className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Target className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Stats Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Total XP Earned</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">
                    {gamificationData.xp.totalXPEarned.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Perfect Lessons</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {gamificationData.stats.perfectLessons}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Study Time</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(gamificationData.stats.totalStudyMinutes / 60)}h {gamificationData.stats.totalStudyMinutes % 60}m
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Streak Bonus</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    x{gamificationData.streak.streakBonusMultiplier.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                nameAr={badge.nameAr}
                description={badge.description}
                descriptionAr={badge.descriptionAr}
                icon={badge.icon}
                rarity={badge.rarity}
                earned={badge.earned}
                progress={badge.progress}
                maxProgress={badge.maxProgress}
              />
            ))}
          </div>
          {badges.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No badges yet</p>
              <p className="text-sm">Complete lessons and maintain streaks to earn badges!</p>
            </div>
          )}
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges">
          <DailyChallenges
            challenges={dailyChallenges}
            onClaimReward={onClaimChallenge}
          />
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Leaderboard initialData={leaderboardData} showTabs={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
