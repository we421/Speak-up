import { NextRequest, NextResponse } from 'next/server'
import CurriculumSystem from '@/lib/curriculum'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get('level') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null
    const action = searchParams.get('action')

    if (action === 'initialize') {
      // Initialize all lessons in the database
      const count = await CurriculumSystem.initializeLessons()
      return NextResponse.json({
        success: true,
        message: `Initialized ${count} lessons`,
      })
    }

    if (level) {
      // Get lessons by level
      const lessons = await CurriculumSystem.getLessonsByLevel(level)
      return NextResponse.json({
        level,
        lessons,
      })
    }

    return NextResponse.json(
      { error: 'level or action parameter is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching curriculum:', error)
    return NextResponse.json(
      { error: 'Failed to fetch curriculum' },
      { status: 500 }
    )
  }
}
