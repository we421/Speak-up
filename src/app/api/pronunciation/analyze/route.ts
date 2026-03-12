import { NextRequest, NextResponse } from 'next/server'
import PronunciationAI from '@/lib/pronunciation-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audio, expectedText, language = 'en-US' } = body

    if (!audio || !expectedText) {
      return NextResponse.json(
        { error: 'audio and expectedText are required' },
        { status: 400 }
      )
    }

    // Initialize PronunciationAI (would pass LLM and ASR instances)
    const pronunciationAI = new PronunciationAI(null, null)

    // Analyze pronunciation
    const result = await pronunciationAI.analyzePronunciation(
      audio,
      expectedText,
      language
    )

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Error analyzing pronunciation:', error)
    return NextResponse.json(
      { error: 'Failed to analyze pronunciation' },
      { status: 500 }
    )
  }
}

// Get practice materials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const level = (searchParams.get('level') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') || 'BEGINNER'

    const materials = PronunciationAI.getPracticeMaterials(level)

    return NextResponse.json({
      level,
      materials,
    })
  } catch (error) {
    console.error('Error getting practice materials:', error)
    return NextResponse.json(
      { error: 'Failed to get practice materials' },
      { status: 500 }
    )
  }
}
