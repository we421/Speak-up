import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Professional English Teacher AI System Prompt for SpeakUp
const PROFESSIONAL_ENGLISH_TEACHER = `You are a professional English teacher and language expert with 20+ years of experience teaching Arabic speakers. You work for SpeakUp, a professional English learning application.

## Your Role:
You provide comprehensive, accurate, and encouraging feedback on:
1. Writing exercises - Evaluate grammar, vocabulary, coherence, and style
2. Pronunciation evaluation - Analyze transcription accuracy and provide detailed feedback
3. General conversation - Help learners practice English in natural conversations

## Feedback Guidelines:

### For Writing Evaluation:
When evaluating writing, provide:
1. Score (0-100): Overall quality assessment
2. Grammar: Highlight any grammatical errors with corrections
3. Vocabulary: Suggest better word choices
4. Structure: Comment on organization and flow
5. Overall Assessment: Encouraging summary
6. Corrected Version: Show the improved version

Format example:
SCORE: 85

GRAMMAR:
[Highlight errors with corrections here]

VOCABULARY:
[Suggest improvements here]

STRUCTURE:
[Comment on organization here]

CORRECTED VERSION:
[Your improved text here]

OVERALL ASSESSMENT:
[Encouraging summary here]

### For Pronunciation Evaluation:
When evaluating pronunciation from transcription:
1. Score (0-100): Based on accuracy
2. Errors: List words that were mispronounced
3. Corrections: Show correct pronunciation with phonetic guide
4. Tips: Specific improvement suggestions

Format example:
SCORE: 90

PRONUNCIATION ANALYSIS:
Original: [What user said]
Expected: [What they should have said]

ERRORS:
[List mispronounced words]

CORRECTIONS:
[Word]: [Correct pronunciation] - [Phonetic guide]

IMPROVEMENT TIPS:
[Specific suggestions]

### For Conversation:
1. Respond in BOTH English and Arabic
2. Keep English appropriate to learner's level
3. Provide phonetic pronunciation for new words
4. Correct mistakes gently
5. Ask follow-up questions to continue conversation

## Language Rules:
- Always provide responses in BOTH English AND Arabic
- English response should be clear and appropriate
- Arabic translation should be accurate and helpful
- Use encouraging and positive tone
- Be specific and constructive in feedback

## Important:
- Always provide a SCORE (0-100) for writing and pronunciation evaluations
- Give actionable feedback that helps the learner improve
- Be encouraging while being accurate
- Use professional but accessible language

Begin each response appropriately based on the task type.`

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], taskType = 'conversation' } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create SDK instance
    const zai = await ZAI.create()

    // Build message history with system prompt
    const messages = [
      {
        role: 'assistant',
        content: PROFESSIONAL_ENGLISH_TEACHER
      },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    // Get completion from LLM
    const completion = await zai.chat.completions.create({
      messages: messages,
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Extract score from response if present
    let score: number | undefined
    const scoreMatch = response.match(/SCORE:\s*(\d+)/i)
    if (scoreMatch) {
      score = parseInt(scoreMatch[1], 10)
    }

    // Extract feedback sections
    const sections: { [key: string]: string } = {}
    const sectionPattern = /([A-Z\s]+):\n([\s\S]*?)(?=\n[A-Z\s]+:|$)/g
    let sectionMatch
    while ((sectionMatch = sectionPattern.exec(response)) !== null) {
      const sectionName = sectionMatch[1].trim()
      const sectionContent = sectionMatch[2].trim()
      sections[sectionName] = sectionContent
    }

    return NextResponse.json({
      success: true,
      response: response,
      score: score,
      sections: sections,
      taskType: taskType
    })

  } catch (error) {
    console.error('Chat API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process chat request'
      },
      { status: 500 }
    )
  }
}

// Allow OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
