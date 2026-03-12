# 🎤 SpeakUp - Professional English Learning App

Learn English professionally with AI-powered reading, writing, listening, and pronunciation exercises.

## ✨ Features

### 🎯 Multi-Level Learning
- **Beginner** (أساسيات) - Start your English journey
- **Intermediate** (متوسط) - Build on your foundation
- **Advanced** (متقدم) - Master the language

### 📖 Reading Practice
- Engaging texts for all levels
- Listen to native pronunciation (TTS)
- Arabic translations
- Record yourself reading
- AI pronunciation correction

### ✍️ Writing Exercises
- Structured writing prompts
- AI-powered feedback
- Grammar and vocabulary suggestions
- Scored evaluations
- Improved versions

### 🎧 Listening Practice
- Audio exercises
- Comprehension questions
- Multiple choice and text input
- Instant feedback

### 🎤 Pronunciation Training
- Practice common sentences
- Listen to correct pronunciation
- Record your voice
- AI scoring and feedback
- Detailed improvement tips

### 📊 Progress Tracking
- Track all skills
- Level progress
- Achievement badges
- Study statistics

## 🚀 Quick Start

### Requirements
- Node.js 18+
- Bun or npm

### Installation

```bash
# Install dependencies
bun install

# Setup database
bun run db:push

# Start development server
bun run dev
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```
speakup/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts  # AI chat API
│   │   │   ├── tts/route.ts   # Text-to-speech API
│   │   │   └── asr/route.ts   # Speech-to-text API
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page
│   │   └── globals.css        # Global styles
│   ├── components/ui/         # shadcn/ui components
│   └── lib/
│       ├── db.ts              # Database client
│       └── utils.ts           # Utilities
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM + SQLite
- **AI**: z-ai-web-dev-sdk (LLM, TTS, ASR)
- **Icons**: Lucide React

## 📱 PWA Installation

### Android (Chrome)
1. Open app in Chrome
2. Tap menu (three dots)
3. "Install App" or "Add to Home Screen"

### iPhone (Safari)
1. Open app in Safari
2. Tap Share button ↑
3. "Add to Home Screen"

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Deploy

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/speakup.git
git push -u origin main
```

### Netlify

1. Connect GitHub repository
2. Build command: `bun run build`
3. Publish directory: `.next`

## 🎨 Features in Detail

### Reading Exercises
- 3 difficulty levels
- Audio playback with TTS
- Arabic translations
- Recording capability
- AI pronunciation feedback

### Writing Evaluation
- AI-powered grammar checking
- Vocabulary suggestions
- Structure analysis
- Scored feedback (0-100)
- Corrected versions

### Listening Comprehension
- Native audio
- Various topics
- Question types: multiple choice, text input
- Instant feedback

### Pronunciation Practice
- Common everyday sentences
- Listen first, then practice
- Record and compare
- AI scoring with detailed feedback
- Improvement tips

## 📊 Data Models

### Database Schema
- **User** - User accounts
- **EnglishLearner** - Learning profiles
- **ReadingText** - Reading materials
- **Exercise** - Writing/listening exercises
- **RecordingHistory** - Pronunciation recordings
- **ExerciseAttempt** - Exercise attempts
- **LevelProgress** - Level completion tracking

## 🔧 API Endpoints

### POST /api/chat
AI-powered chat and feedback for writing/pronunciation evaluation.

**Request:**
```json
{
  "message": "Your text or question",
  "history": [],
  "taskType": "writing|pronunciation|conversation"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response with feedback",
  "score": 85,
  "sections": {
    "GRAMMAR": "...",
    "VOCABULARY": "...",
    "CORRECTED VERSION": "..."
  }
}
```

### POST /api/tts
Convert text to speech.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "voice": "tongtong",
  "speed": 1.0
}
```

**Response:** Audio file (WAV format)

### POST /api/asr
Convert speech to text.

**Request:**
```json
{
  "audio": "base64_encoded_audio"
}
```

**Response:**
```json
{
  "success": true,
  "transcription": "Hello, how are you?"
}
```

## 🎯 Learning Levels

### Beginner (أساسيات)
- Basic vocabulary and phrases
- Simple sentence structures
- Everyday topics
- Foundation building

### Intermediate (متوسط)
- Expanded vocabulary
- Complex sentences
- Various tenses
- Real-world conversations

### Advanced (متقدم)
- Professional vocabulary
- Nuanced expressions
- Academic and business English
- Fluent communication

## 📈 Progress Tracking

### Skills Tracked
- **Reading** - Texts completed, comprehension
- **Writing** - Grammar, vocabulary, structure
- **Listening** - Comprehension accuracy
- **Pronunciation** - Speech accuracy, fluency

### Achievements
- First exercise completed
- Level mastery
- Perfect scores
- Consistent practice

## 🌍 Bilingual Support

All content includes:
- ✅ English text/audio
- ✅ Arabic translations
- ✅ Bilingual instructions
- ✅ Dual-language feedback

## 💡 Tips for Learners

1. **Start with your level** - Choose appropriate difficulty
2. **Practice daily** - Consistency is key
3. **Record yourself** - Compare with native pronunciation
4. **Read aloud** - Improve fluency
5. **Review feedback** - Learn from corrections
6. **Track progress** - Celebrate improvements

## 🤝 Contributing

This app is designed to be personalized. Feel free to:
- Add your own reading texts
- Create custom exercises
- Adjust difficulty levels
- Personalize the experience

## 📄 License

This app is yours to customize and use. You can:
- ✅ Customize with your brand
- ✅ Deploy and use
- ✅ Modify features
- ✅ Add monetization

## 🆘 Support

For help or questions, refer to:
- API documentation in `src/app/api/`
- Database schema in `prisma/schema.prisma`
- Component docs in `src/components/ui/`

---

**Made with ❤️ for English learners everywhere**

🌊 **SpeakUp** - Your Path to English Fluency
