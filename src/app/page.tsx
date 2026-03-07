'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import AdBanner from '@/components/AdBanner'
import { analytics } from '@/lib/analytics'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import {
  BookOpen,
  Mic,
  PlayCircle,
  PauseCircle,
  Volume2,
  Clock,
  Award,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Headphones,
  PenTool,
  MessageSquare,
  ChevronRight,
  Star,
  Target,
  FileText,
  Sparkles,
  Globe,
  Heart,
  Zap,
  Crown,
  Lightbulb
} from 'lucide-react'

// Type Definitions
type ReadingText = {
  id: number
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  content: string
  translation: string
}

type WritingExercise = {
  id: number
  question: string
  translation: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

type ListeningExercise = {
  id: number
  title: string
  description: string
  duration: string
  question: string
  translation: string
  options?: string[]
}

type PronunciationSentence = {
  id: number
  sentence: string
  translation: string
}

type Level = 'Beginner' | 'Intermediate' | 'Advanced'
type TabType = 'reading' | 'writing' | 'listening' | 'pronunciation' | 'progress'

// Sample Data
const readingTexts: ReadingText[] = [
  {
    id: 1,
    title: "A Day in the Life",
    difficulty: "Beginner",
    duration: "5 min",
    content: `Emma wakes up early every morning. She likes to start her day with a cup of coffee and some fresh air. She walks in the park for thirty minutes before going to work. Emma works as a teacher at a local school. She loves her job and enjoys helping her students learn new things every day.`,
    translation: "تستيقظ إيما مبكراً كل صباح. تحب أن تبدأ يومها بفنجان قهوة وبعض الهواء النقي. تمشي في الحديقة لمدة ثلاثين دقيقة قبل الذهاب إلى العمل. إيما تعمل كمدرسة في مدرسة محلية. تحب وظيفتها وتستمتع بمساعدة طلابها على تعلم أشياء جديدة كل يوم."
  },
  {
    id: 2,
    title: "The Coffee Shop",
    difficulty: "Intermediate",
    duration: "8 min",
    content: `The aroma of freshly brewed coffee fills the air as I step into the cozy café. The walls are adorned with local artwork, and soft jazz music plays in the background. I order my usual – a latte with almond milk. The barista knows me by name and starts preparing my drink before I even reach the counter. This little coffee shop has become my sanctuary from the busy world outside.`,
    translation: "تفوح رائحة القهوة الطازجة في الهواء عندما أدخل المقهى المريح. تزين الجدران بالأعمال الفنية المحلية، وتعزف موسيقى الجاز الناعمة في الخلفية. أطلب مشروبي المعتاد - لاتيه بحمل اللوز. يعرف الباريستا اسمي ويبدأ في تحضير مشروبي قبل أن أصل حتى إلى العداد. أصبح هذا المقهى الصغير ملجئي من العالم المزدحم في الخارج."
  },
  {
    id: 3,
    title: "Technology and Society",
    difficulty: "Advanced",
    duration: "12 min",
    content: `In the rapidly evolving landscape of modern technology, artificial intelligence has emerged as a transformative force reshaping various aspects of human civilization. From healthcare diagnostics to autonomous vehicles, AI systems are increasingly integrated into our daily lives, promising unprecedented efficiency while raising profound ethical questions about privacy, employment, and the very nature of human cognition. As we navigate this technological frontier, it becomes imperative to establish robust frameworks that ensure these powerful tools serve humanity's best interests while mitigating potential risks.`,
    translation: "في المشهد المتطور بسرعة للتكنولوجيا الحديثة، ظهرت الذكاء الاصطناعي كقوة تحويلية تعيد تشكيل جوانب مختلفة من الحضارة الإنسانية. من تشخيصات الرعاية الصحية إلى المركبات المستقلة، تتكامل أنظمة الذكاء الاصطناعي بشكل متزايد في حياتنا اليومية، وتعد بكفاءة غير مسبوقة مع إثارة أسئلة أخلاقية عميقة حول الخصوصية والعمالة وطبيعة الإدراك البشري نفسها. وبينما نتنقل في هذا الحدود التكنولوجية، يصبح من الضروري إنشاء أطر قوية تضمن أن تخدم هذه الأدوات القوية مصلحة البشرية الأفضل مع تخفيف المخاطر المحتملة."
  }
]

const writingExercises: WritingExercise[] = [
  {
    id: 1,
    question: "Write about your favorite hobby.",
    translation: "اكتب عن هوايتك المفضلة.",
    difficulty: "Beginner"
  },
  {
    id: 2,
    question: "Describe your last vacation.",
    translation: "صف إجازتك الأخيرة.",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    question: "Discuss the impact of social media on communication.",
    translation: "ناقش تأثير وسائل التواصل الاجتماعي على التواصل.",
    difficulty: "Advanced"
  }
]

const listeningExercises: ListeningExercise[] = [
  {
    id: 1,
    title: "Basic Colors",
    description: "What color is the sky?",
    duration: "1 min",
    question: "What color is the sky?",
    translation: "ما هو لون السماء؟",
    options: ["Red", "Blue", "Green", "Yellow"]
  },
  {
    id: 2,
    title: "Past Activities",
    description: "What did you do yesterday?",
    duration: "2 min",
    question: "What did you do yesterday?",
    translation: "ماذا فعلت أمس؟",
    options: ["I will go shopping", "I went to the park", "I am reading a book", "I have a car"]
  },
  {
    id: 3,
    title: "Climate Discussion",
    description: "What are your thoughts on climate change?",
    duration: "3 min",
    question: "What are your thoughts on climate change?",
    translation: "ما هي أفكارك حول تغير المناخ؟"
  }
]

const pronunciationSentences: PronunciationSentence[] = [
  {
    id: 1,
    sentence: "Hello, how are you today?",
    translation: "مرحباً، كيف حالك اليوم؟"
  },
  {
    id: 2,
    sentence: "I would like a cup of coffee.",
    translation: "أود كوباً من القهوة."
  },
  {
    id: 3,
    sentence: "The weather is beautiful today.",
    translation: "الطقس جميل اليوم."
  },
  {
    id: 4,
    sentence: "Could you please help me?",
    translation: "هل يمكنك مساعدتي من فضلك؟"
  },
  {
    id: 5,
    sentence: "I'm learning English every day.",
    translation: "أتعلم الإنجليزية كل يوم."
  }
]

export default function SpeakUpPage() {
  // User Stats
  const [studyTime, setStudyTime] = useState(45)
  const [exercisesCompleted, setExercisesCompleted] = useState(12)
  const [currentLevel, setCurrentLevel] = useState<Level>('Beginner')
  const [overallProgress, setOverallProgress] = useState(23)

  // Tabs and Selection
  const [activeTab, setActiveTab] = useState<TabType>('reading')
  const [selectedLevel, setSelectedLevel] = useState<Level>('Beginner')

  // Reading Section
  const [selectedReading, setSelectedReading] = useState<ReadingText | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)

  // Writing Section
  const [selectedWriting, setSelectedWriting] = useState<WritingExercise | null>(null)
  const [writingAnswer, setWritingAnswer] = useState('')
  const [writingFeedback, setWritingFeedback] = useState('')
  const [writingScore, setWritingScore] = useState<number | null>(null)
  const [isSubmittingWriting, setIsSubmittingWriting] = useState(false)

  // Listening Section
  const [selectedListening, setSelectedListening] = useState<ListeningExercise | null>(null)
  const [listeningAnswer, setListeningAnswer] = useState('')
  const [listeningFeedback, setListeningFeedback] = useState('')
  const [isSubmittingListening, setIsSubmittingListening] = useState(false)

  // Pronunciation Section
  const [pronunciationRecordings, setPronunciationRecordings] = useState<Record<number, { url: string; score: number; feedback: string }>>({})

  // Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState<Record<number, boolean>>({})
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // TTS Function
  const speakText = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.play()
      }
    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  // Recording Functions
  const startRecording = async (sentenceId?: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (sentenceId !== undefined) {
          // For pronunciation, get feedback
          await getPronunciationFeedback(audioBlob, sentenceId)
        }
        
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('تعذر الوصول إلى الميكروفون. يرجى السماح بالوصول.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const getPronunciationFeedback = async (audioBlob: Blob, sentenceId: number) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1]
        if (base64Audio) {
          const response = await fetch('/api/asr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio })
          })
          const data = await response.json()
          
          // Simulate scoring (in real app, this would come from AI)
          const score = Math.floor(Math.random() * 20) + 80
          const feedback = data.transcription ? `Great job! You said: "${data.transcription}"` : "Try again, speak clearly."
          
          setPronunciationRecordings(prev => ({
            ...prev,
            [sentenceId]: {
              url: URL.createObjectURL(audioBlob),
              score,
              feedback
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error getting pronunciation feedback:', error)
    }
  }

  // Writing Submission
  const submitWriting = async () => {
    if (!selectedWriting || !writingAnswer.trim()) return

    setIsSubmittingWriting(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Evaluate this English writing exercise. Question: "${selectedWriting.question}". Student's answer: "${writingAnswer}". Provide feedback in both English and Arabic, and give a score out of 100.`
        })
      })

      const data = await response.json()
      setWritingFeedback(data.response)
      setWritingScore(Math.floor(Math.random() * 20) + 80)
      setExercisesCompleted(prev => prev + 1)
    } catch (error) {
      console.error('Error submitting writing:', error)
    } finally {
      setIsSubmittingWriting(false)
    }
  }

  // Listening Submission
  const submitListening = async () => {
    if (!selectedListening || !listeningAnswer.trim()) return

    setIsSubmittingListening(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Evaluate this listening exercise. Question: "${selectedListening.question}". Student's answer: "${listeningAnswer}". Provide feedback.`
        })
      })

      const data = await response.json()
      setListeningFeedback(data.response)
      setExercisesCompleted(prev => prev + 1)
    } catch (error) {
      console.error('Error submitting listening:', error)
    } finally {
      setIsSubmittingListening(false)
    }
  }

  // Level Config
  const levelConfig = {
    Beginner: {
      icon: <Heart className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      arabic: "أساسيات",
      progress: 65
    },
    Intermediate: {
      icon: <Zap className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-600",
      arabic: "متوسط",
      progress: 30
    },
    Advanced: {
      icon: <Crown className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      arabic: "متقدم",
      progress: 10
    }
  }

  // Tab Config
  const tabConfig = {
    reading: { icon: <BookOpen />, label: "Reading", arabic: "القراءة", gradient: "from-blue-500 to-cyan-500" },
    writing: { icon: <PenTool />, label: "Writing", arabic: "الكتابة", gradient: "from-purple-500 to-pink-500" },
    listening: { icon: <Headphones />, label: "Listening", arabic: "الاستماع", gradient: "from-green-500 to-emerald-500" },
    pronunciation: { icon: <Mic />, label: "Pronunciation", arabic: "النطق", gradient: "from-orange-500 to-red-500" },
    progress: { icon: <TrendingUp />, label: "Progress", arabic: "التقدم", gradient: "from-indigo-500 to-purple-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header - Sticky */}
      <header className="border-b bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SpeakUp
                </h1>
                <p className="text-sm text-gray-500">Master English with Confidence</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-2 px-4 py-2 bg-indigo-50 border-indigo-200 text-indigo-700">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{studyTime} min</span>
                <span className="text-indigo-500 text-xs">Study Time</span>
              </Badge>
              <Badge className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-4 py-2">
                <Award className="w-4 h-4" />
                <span className="font-semibold">{exercisesCompleted}</span>
                <span className="text-green-100 text-xs">Exercises</span>
              </Badge>
              <Badge className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{currentLevel}</span>
                <span className="text-purple-100 text-xs">Level</span>
              </Badge>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {overallProgress}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Started your journey</span>
              <span>Keep going! {100 - overallProgress}% to fluency</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Level Selection Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Choose Your Level
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {(Object.keys(levelConfig) as Level[]).map((level) => {
              const config = levelConfig[level]
              return (
                <Card
                  key={level}
                  onClick={() => {
                    setSelectedLevel(level)
                    setCurrentLevel(level)
                  }}
                  className={`card-hover cursor-pointer border-2 ${
                    selectedLevel === level
                      ? 'border-indigo-500 shadow-xl shadow-indigo-200'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {config.icon}
                        <div>
                          <CardTitle className="text-xl">{level}</CardTitle>
                          <CardDescription className="text-white/90 text-sm">
                            {config.arabic}
                          </CardDescription>
                        </div>
                      </div>
                      {selectedLevel === level && (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-800">{config.progress}%</span>
                        </div>
                        <Progress value={config.progress} className="h-2" />
                      </div>
                      <p className="text-xs text-gray-500">
                        {level === 'Beginner' && 'Perfect for starting your English journey'}
                        {level === 'Intermediate' && 'Build on your foundation'}
                        {level === 'Advanced' && 'Master professional English'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1.5 bg-white shadow-xl rounded-2xl border-2 border-gray-100">
            {(Object.keys(tabConfig) as TabType[]).map((tab) => {
              const config = tabConfig[tab]
              return (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:text-white transition-all duration-300"
                  style={
                    activeTab === tab
                      ? { background: `linear-gradient(to right, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }
                      : {}
                  }
                >
                  <span className="text-lg">{config.icon}</span>
                  <div className="hidden sm:block text-left">
                    <div className="font-semibold text-sm">{config.label}</div>
                    <div className="text-xs opacity-80">{config.arabic}</div>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Reading Tab */}
          <TabsContent value="reading" className="space-y-6">
            <Card className="shadow-xl border-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6" />
                    <div>
                      <CardTitle className="text-2xl">Reading Practice</CardTitle>
                      <CardDescription className="text-blue-50">
                        Improve your reading comprehension with engaging texts
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {readingTexts.length} texts available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedReading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {readingTexts.map((text) => (
                      <Card
                        key={text.id}
                        className="card-hover cursor-pointer border-2 hover:border-blue-300"
                        onClick={() => setSelectedReading(text)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <Badge
                              className={
                                text.difficulty === 'Beginner'
                                  ? 'bg-green-500'
                                  : text.difficulty === 'Intermediate'
                                  ? 'bg-blue-500'
                                  : 'bg-purple-500'
                              }
                            >
                              {text.difficulty}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {text.duration}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mt-3">{text.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            <FileText className="w-4 h-4" />
                            Read Now
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedReading(null)
                          setShowTranslation(false)
                        }}
                      >
                        ← Back to texts
                      </Button>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            selectedReading.difficulty === 'Beginner'
                              ? 'bg-green-500'
                              : selectedReading.difficulty === 'Intermediate'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                          }
                        >
                          {selectedReading.difficulty}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedReading.duration}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedReading.title}</h3>
                      <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                        {selectedReading.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => speakText(selectedReading.content)}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        <Volume2 className="w-5 h-5" />
                        Listen to Text
                      </Button>
                      <Button
                        onClick={() => setShowTranslation(!showTranslation)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Globe className="w-5 h-5" />
                        {showTranslation ? 'Hide' : 'Show'} Arabic Translation
                      </Button>
                      <Button
                        onClick={() => startRecording()}
                        variant={isRecording ? "destructive" : "outline"}
                        className="gap-2"
                      >
                        {isRecording ? (
                          <>
                            <PauseCircle className="w-5 h-5" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            Record Reading
                          </>
                        )}
                      </Button>
                    </div>

                    {showTranslation && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 fade-in">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-800">
                          <Globe className="w-5 h-5" />
                          Arabic Translation
                        </h4>
                        <p className="text-lg leading-relaxed text-gray-700 text-right" dir="rtl">
                          {selectedReading.translation}
                        </p>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">Practice Complete!</h4>
                          <p className="text-indigo-100 text-sm mt-1">Great job reading this text</p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedReading(null)
                            setShowTranslation(false)
                            setExercisesCompleted(prev => prev + 1)
                          }}
                          className="bg-white text-indigo-600 hover:bg-indigo-50"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Mark as Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Writing Tab */}
          <TabsContent value="writing" className="space-y-6">
            <Card className="shadow-xl border-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PenTool className="w-6 h-6" />
                    <div>
                      <CardTitle className="text-2xl">Writing Practice</CardTitle>
                      <CardDescription className="text-purple-50">
                        Express yourself in English with guided exercises
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {writingExercises.length} exercises available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedWriting ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {writingExercises.map((exercise) => (
                      <Card
                        key={exercise.id}
                        className="card-hover cursor-pointer border-2 hover:border-purple-300"
                        onClick={() => setSelectedWriting(exercise)}
                      >
                        <CardHeader>
                          <Badge
                            className={
                              exercise.difficulty === 'Beginner'
                                ? 'bg-green-500'
                                : exercise.difficulty === 'Intermediate'
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                            }
                          >
                            {exercise.difficulty}
                          </Badge>
                          <CardTitle className="text-lg mt-3">{exercise.question}</CardTitle>
                          <CardDescription className="text-right" dir="rtl">
                            {exercise.translation}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            <PenTool className="w-4 h-4" />
                            Start Writing
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 fade-in">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedWriting(null)
                        setWritingAnswer('')
                        setWritingFeedback('')
                        setWritingScore(null)
                      }}
                    >
                      ← Back to exercises
                    </Button>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                      <div className="flex items-start justify-between mb-4">
                        <Badge
                          className={
                            selectedWriting.difficulty === 'Beginner'
                              ? 'bg-green-500'
                              : selectedWriting.difficulty === 'Intermediate'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                          }
                        >
                          {selectedWriting.difficulty}
                        </Badge>
                        <Button
                          onClick={() => speakText(selectedWriting.question)}
                          variant="ghost"
                          size="sm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">
                        {selectedWriting.question}
                      </h3>
                      <p className="text-gray-600 text-right" dir="rtl">
                        {selectedWriting.translation}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Your Answer:</label>
                      <Textarea
                        value={writingAnswer}
                        onChange={(e) => setWritingAnswer(e.target.value)}
                        placeholder="Write your answer in English..."
                        className="min-h-[200px] text-lg"
                      />
                    </div>

                    <Button
                      onClick={submitWriting}
                      disabled={!writingAnswer.trim() || isSubmittingWriting}
                      className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6"
                    >
                      {isSubmittingWriting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Submit for AI Feedback
                        </>
                      )}
                    </Button>

                    {writingFeedback && (
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200 fade-in">
                        {writingScore !== null && (
                          <div className="flex items-center gap-3 mb-4">
                            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {writingScore}/100
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-6 h-6 ${
                                    i < Math.floor(writingScore / 20)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          AI Feedback:
                        </h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {writingFeedback}
                        </p>
                        <Button
                          onClick={() => {
                            setSelectedWriting(null)
                            setWritingAnswer('')
                            setWritingFeedback('')
                            setWritingScore(null)
                          }}
                          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          Continue to Next Exercise
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listening Tab */}
          <TabsContent value="listening" className="space-y-6">
            <Card className="shadow-xl border-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Headphones className="w-6 h-6" />
                    <div>
                      <CardTitle className="text-2xl">Listening Practice</CardTitle>
                      <CardDescription className="text-green-50">
                        Train your ear with audio exercises
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {listeningExercises.length} exercises available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedListening ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listeningExercises.map((exercise) => (
                      <Card
                        key={exercise.id}
                        className="card-hover cursor-pointer border-2 hover:border-green-300"
                        onClick={() => setSelectedListening(exercise)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <Badge className="bg-green-500">{exercise.duration}</Badge>
                            <Badge variant="outline" className="gap-1">
                              <Headphones className="w-3 h-3" />
                              Audio
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mt-3">{exercise.title}</CardTitle>
                          <CardDescription className="text-right" dir="rtl">
                            {exercise.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            <PlayCircle className="w-4 h-4" />
                            Start Listening
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 fade-in">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedListening(null)
                        setListeningAnswer('')
                        setListeningFeedback('')
                      }}
                    >
                      ← Back to exercises
                    </Button>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">{selectedListening.title}</h3>
                        <Button
                          onClick={() => speakText(selectedListening.question)}
                          size="lg"
                          className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Play Audio
                        </Button>
                      </div>
                      <p className="text-gray-600 text-right mb-4" dir="rtl">
                        {selectedListening.translation}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                      <h4 className="font-semibold mb-4 text-gray-800">
                        Question: {selectedListening.question}
                      </h4>

                      {selectedListening.options ? (
                        <div className="grid gap-3">
                          {selectedListening.options.map((option, index) => (
                            <Button
                              key={index}
                              variant={listeningAnswer === option ? "default" : "outline"}
                              onClick={() => setListeningAnswer(option)}
                              className={`justify-start text-left h-auto py-4 px-6 ${
                                listeningAnswer === option
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                  : ''
                              }`}
                            >
                              <span className="font-mono mr-3">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <Textarea
                          value={listeningAnswer}
                          onChange={(e) => setListeningAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          className="min-h-[120px]"
                        />
                      )}
                    </div>

                    <Button
                      onClick={submitListening}
                      disabled={!listeningAnswer.trim() || isSubmittingListening}
                      className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg py-6"
                    >
                      {isSubmittingListening ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Submit Answer
                        </>
                      )}
                    </Button>

                    {listeningFeedback && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 fade-in">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          Feedback:
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{listeningFeedback}</p>
                        <Button
                          onClick={() => {
                            setSelectedListening(null)
                            setListeningAnswer('')
                            setListeningFeedback('')
                          }}
                          className="mt-4 w-full bg-green-600 hover:bg-green-700"
                        >
                          Continue to Next Exercise
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pronunciation Tab */}
          <TabsContent value="pronunciation" className="space-y-6">
            <Card className="shadow-xl border-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mic className="w-6 h-6" />
                    <div>
                      <CardTitle className="text-2xl">Pronunciation Practice</CardTitle>
                      <CardDescription className="text-orange-50">
                        Perfect your accent with AI-powered feedback
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {pronunciationSentences.length} sentences
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {pronunciationSentences.map((item, index) => {
                    const recording = pronunciationRecordings[item.id]
                    return (
                      <Card
                        key={item.id}
                        className={`border-2 ${recording ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-orange-500">{index + 1}</Badge>
                                <Button
                                  onClick={() => speakText(item.sentence)}
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                  <Volume2 className="w-4 h-4" />
                                  Listen
                                </Button>
                              </div>
                              <p className="text-xl font-semibold text-gray-800 mb-2">
                                {item.sentence}
                              </p>
                              <p className="text-gray-600 text-right" dir="rtl">
                                {item.translation}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2">
                              {!recording ? (
                                <Button
                                  onClick={() => {
                                    if (!isRecording) {
                                      startRecording(item.id)
                                    } else {
                                      stopRecording()
                                    }
                                  }}
                                  variant={isRecording ? "destructive" : "outline"}
                                  className="gap-2"
                                >
                                  {isRecording ? (
                                    <>
                                      <PauseCircle className="w-5 h-5" />
                                      Stop
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="w-5 h-5" />
                                      Record
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-500 text-white">
                                      Score: {recording.score}/100
                                    </Badge>
                                    <Button
                                      onClick={() => {
                                        const audio = new Audio(recording.url)
                                        audio.play()
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <PlayCircle className="w-4 h-4 mr-1" />
                                      Play
                                    </Button>
                                  </div>
                                  <p className="text-sm text-gray-600">{recording.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-xl border-2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="w-8 h-8 opacity-80" />
                    <Badge className="bg-white/20 text-white border-white/30">
                      Reading
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold mb-1">8</div>
                  <div className="text-blue-100">Texts Read</div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <PenTool className="w-8 h-8 opacity-80" />
                    <Badge className="bg-white/20 text-white border-white/30">
                      Writing
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold mb-1">85</div>
                  <div className="text-purple-100">Average Score</div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Headphones className="w-8 h-8 opacity-80" />
                    <Badge className="bg-white/20 text-white border-white/30">
                      Listening
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold mb-1">92</div>
                  <div className="text-green-100">Average Score</div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Mic className="w-8 h-8 opacity-80" />
                    <Badge className="bg-white/20 text-white border-white/30">
                      Pronunciation
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold mb-1">88</div>
                  <div className="text-orange-100">Average Score</div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="text-2xl">Level Progress</CardTitle>
                <CardDescription className="text-indigo-100">
                  Track your journey through each difficulty level
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {(Object.keys(levelConfig) as Level[]).map((level) => {
                  const config = levelConfig[level]
                  return (
                    <div key={level} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-white`}>
                            {config.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{level}</h4>
                            <p className="text-sm text-gray-500">{config.arabic}</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {config.progress}%
                        </span>
                      </div>
                      <Progress value={config.progress} className="h-3" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Award className="w-7 h-7" />
                  Achievements
                </CardTitle>
                <CardDescription className="text-amber-100">
                  Badges earned on your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "First Steps", icon: "🎯", earned: true, desc: "Complete your first exercise" },
                    { name: "Bookworm", icon: "📚", earned: true, desc: "Read 5 texts" },
                    { name: "Voice Master", icon: "🎤", earned: true, desc: "Score 90+ in pronunciation" },
                    { name: "Writing Pro", icon: "✍️", earned: true, desc: "Complete 10 writing exercises" },
                    { name: "Listener", icon: "🎧", earned: false, desc: "Complete 20 listening exercises" },
                    { name: "Fluent Speaker", icon: "🌟", earned: false, desc: "Achieve 95% overall progress" }
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        achievement.earned
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{achievement.desc}</p>
                          {achievement.earned && (
                            <Badge className="mt-2 bg-amber-500">Unlocked</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SpeakUp
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Master English with Confidence • Professional Learning Platform
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Built with ❤️ for Arabic speakers learning English
          </p>
        </div>
      </footer>
    </div>
  )
}
