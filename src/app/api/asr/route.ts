import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const { audio } = await req.json()

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json(
        { error: 'Audio data is required (base64 encoded)' },
        { status: 400 }
      )
    }

    // Validate base64 string
    try {
      Buffer.from(audio, 'base64')
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid base64 audio data' },
        { status: 400 }
      )
    }

    // Create SDK instance
    const zai = await ZAI.create()

    // Transcribe audio
    const response = await zai.audio.asr.create({
      file_base64: audio
    })

    const transcription = response.text || ''

    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not transcribe audio. Please try speaking more clearly.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      transcription: transcription.trim()
    })

  } catch (error) {
    console.error('ASR API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to transcribe audio'
      },
      { status: 500 }
    )
  }
}

// Allow OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
