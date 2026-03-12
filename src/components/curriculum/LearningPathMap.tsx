'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Lock, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LessonCard from './LessonCard'

interface Lesson {
  id: string
  level: string
  unit: number
  orderIndex: number
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  skills: string
  xpReward: number
  gemReward: number
  isLocked: boolean
  isBonus: boolean
}

interface UserLesson {
  lessonId: string
  completed: boolean
  score?: number
}

interface LearningPathMapProps {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  initialLessons?: Lesson[]
  userLessons?: UserLesson[]
  onLessonClick?: (lessonId: string) => void
}

export default function LearningPathMap({
  level,
  initialLessons = [],
  userLessons = [],
  onLessonClick,
}: LearningPathMapProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set([1]))
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

  // Group lessons by unit
  const lessonsByUnit = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.unit]) {
      acc[lesson.unit] = []
    }
    acc[lesson.unit].push(lesson)
    return acc
  }, {} as Record<number, Lesson[]>)

  const units = Object.keys(lessonsByUnit).map(Number).sort((a, b) => a - b)

  // Get user lesson status
  const getLessonStatus = (lessonId: string) => {
    const userLesson = userLessons.find((ul) => ul.lessonId === lessonId)
    return {
      isCompleted: userLesson?.completed || false,
      score: userLesson?.score,
    }
  }

  const toggleUnit = (unit: number) => {
    setExpandedUnits((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(unit)) {
        newSet.delete(unit)
      } else {
        newSet.add(unit)
      }
      return newSet
    })
  }

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      setSelectedLesson(lesson.id)
      onLessonClick?.(lesson.id)
    }
  }

  // Calculate overall progress
  const totalLessons = lessons.length
  const completedLessons = userLessons.filter((ul) => ul.completed).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {level === 'BEGINNER' ? 'Beginner' : level === 'INTERMEDIATE' ? 'Intermediate' : 'Advanced'} Level
              </CardTitle>
              <p className="text-white/80 mt-1">
                {level === 'BEGINNER' ? 'المستوى المبتدئ' : level === 'INTERMEDIATE' ? 'المستوى المتوسط' : 'المستوى المتقدم'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                <span className="text-2xl font-bold">{completedLessons}/{totalLessons}</span>
              </div>
              <p className="text-sm text-white/80">Lessons Complete</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-white/80 mt-2 text-center">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Units */}
      {units.map((unit) => {
        const unitLessons = lessonsByUnit[unit]
        const isExpanded = expandedUnits.has(unit)
        const unitCompleted = unitLessons.every((lesson) => getLessonStatus(lesson.id).isCompleted)
        const unitLocked = unitLessons.every((lesson) => lesson.isLocked)

        return (
          <Card key={unit} className="overflow-hidden">
            {/* Unit Header */}
            <Button
              variant="ghost"
              onClick={() => toggleUnit(unit)}
              className="w-full h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800 justify-start"
              disabled={unitLocked}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      unitCompleted
                        ? 'bg-green-500'
                        : unitLocked
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                    }`}
                  >
                    {unitLocked ? (
                      <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    ) : unitCompleted ? (
                      <span className="text-white text-xl">✓</span>
                    ) : (
                      <span className="text-white font-bold">{unit}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      Unit {unit}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {unitLessons.length} lessons
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </Button>

            {/* Lessons */}
            {isExpanded && (
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unitLessons.map((lesson) => {
                    const { isCompleted, score } = getLessonStatus(lesson.id)
                    return (
                      <LessonCard
                        key={lesson.id}
                        id={lesson.id}
                        title={lesson.title}
                        titleAr={lesson.titleAr}
                        description={lesson.description}
                        descriptionAr={lesson.descriptionAr}
                        xpReward={lesson.xpReward}
                        gemReward={lesson.gemReward}
                        isLocked={lesson.isLocked}
                        isCompleted={isCompleted}
                        isBonus={lesson.isBonus}
                        score={score}
                        onClick={() => handleLessonClick(lesson)}
                      />
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {lessons.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-gray-500 dark:text-gray-400">No lessons available yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Lessons will appear here soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
