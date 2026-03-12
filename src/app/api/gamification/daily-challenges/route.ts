import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import GamificationSystem from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const learnerId = searchParams.get('learnerId')

    if (!learnerId) {
      return NextResponse.json(
        { error: 'learnerId is required' },
        { status: 400 }
      )
    }

    // Get today's challenges
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    let challenges = await db.dailyChallenge.findMany({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    })

    // If no challenges for today, create them
    if (challenges.length === 0) {
      const challengeTemplates = [
        {
          title: 'Complete 3 Lessons',
          titleAr: 'أكمل 3 دروس',
          description: 'Complete 3 lessons today',
          descriptionAr: 'أكمل 3 دروس اليوم',
          type: 'COMPLETE_LESSONS',
          target: 3,
          xpReward: 30,
          gemsReward: 15,
        },
        {
          title: 'Earn 100 XP',
          titleAr: 'احصل على 100 نقطة خبرة',
          description: 'Earn 100 XP today',
          descriptionAr: 'احصل على 100 نقطة خبرة اليوم',
          type: 'EARN_XP',
          target: 100,
          xpReward: 20,
          gemsReward: 10,
        },
        {
          title: 'Maintain Your Streak',
          titleAr: 'حافظ على استمرارك',
          description: 'Complete at least 1 lesson to maintain your streak',
          descriptionAr: 'أكمل درساً واحداً على الأقل للحفاظ على استمرارك',
          type: 'MAINTAIN_STREAK',
          target: 1,
          xpReward: 15,
          gemsReward: 5,
        },
      ]

      challenges = await Promise.all(
        challengeTemplates.map((template) =>
          db.dailyChallenge.create({
            data: {
              date: today,
              ...template,
            },
          })
        )
      )
    }

    // Get user's progress for each challenge
    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        const userChallenge = await db.userDailyChallenge.findUnique({
          where: {
            learnerId_challengeId: {
              learnerId,
              challengeId: challenge.id,
            },
          },
        })

        let progress = 0

        // Calculate progress based on challenge type
        if (!userChallenge) {
          const profile = await db.gamificationProfile.findUnique({
            where: { learnerId },
          })

          if (challenge.type === 'COMPLETE_LESSONS') {
            progress = profile?.lessonsCompleted || 0
          } else if (challenge.type === 'EARN_XP') {
            progress = profile?.totalXPEarned || 0
          } else if (challenge.type === 'MAINTAIN_STREAK') {
            // Check if user has completed a lesson today
            const todayLessons = await db.userLesson.count({
              where: {
                learnerId,
                completedAt: {
                  gte: todayStart,
                  lt: todayEnd,
                },
              },
            })
            progress = todayLessons
          }
        } else {
          progress = userChallenge.progress
        }

        const isCompleted = progress >= challenge.target

        return {
          ...challenge,
          progress,
          completed: isCompleted,
          claimed: userChallenge?.claimed || false,
        }
      })
    )

    return NextResponse.json({
      challenges: challengesWithProgress,
      date: todayStart,
    })
  } catch (error) {
    console.error('Error fetching daily challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily challenges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { learnerId, challengeId, action } = body

    if (!learnerId || !challengeId || !action) {
      return NextResponse.json(
        { error: 'learnerId, challengeId, and action are required' },
        { status: 400 }
      )
    }

    if (action === 'claim') {
      // Claim challenge reward
      const userChallenge = await db.userDailyChallenge.update({
        where: {
          learnerId_challengeId: {
            learnerId,
            challengeId,
          },
        },
        data: {
          claimed: true,
        },
        include: {
          challenge: true,
        },
      })

      // Award rewards
      await GamificationSystem.addXP(learnerId, userChallenge.challenge.xpReward)

      // Add gems
      await db.gamificationProfile.update({
        where: { learnerId },
        data: {
          gems: { increment: userChallenge.challenge.gemsReward },
        },
      })

      return NextResponse.json({
        success: true,
        xpReward: userChallenge.challenge.xpReward,
        gemsReward: userChallenge.challenge.gemsReward,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating daily challenge:', error)
    return NextResponse.json(
      { error: 'Failed to update daily challenge' },
      { status: 500 }
    )
  }
}
