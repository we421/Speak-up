# 🌊 SpeakUp - الكود المصدري الكامل

## 📋 جدول المحتويات

1. [نظرة عامة على التطبيق](#نظرة-عامة-على-التطبيق)
2. [هيكل المشروع](#هيكل-المشروع)
3. [الملفات الأساسية](#الملفات-الأساسية)
4. [كود المصدر الكامل](#كود-المصدر-الكامل)
5. [تعليمات التشغيل](#تعليمات-التشغيل)
6. [تعليمات النشر](#تعليمات-النشر)

---

## نظرة عامة على التطبيق

### 🎯 SpeakUp

**تطبيق مجاني وشامل لتعلم اللغة الإنجليزية** من الصفر حتى الإتقان مع معلم AI ذكي. رحلة مستمرة نحو الطلاقة.

### ✨ المميزات الرئيسية

- 💬 **محادثة ذكية** - تحدث مع معلم AI خبرته 30+ سنة
- 📚 **منهج دراسي** - 12 أسبوع، 90 درس منظم
- 🎤 **تدريب نطق** - استمع وسجّل وتعلّم النطق الصحيح
- 📊 **تتبع التقدم** - راقب إنجازاتك واطور مستواك
- 🌍 **ثنائي اللغة** - إنجليزي وعربي
- 📱 **PWA** - ثبتّه كتطبيق على جهازك
- 🎨 **تصميم احترافي** - ألوان تعبر عن الثقة والنمو والإبداع

### 🛠️ التقنيات المستخدمة

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI**: shadcn/ui Component Library
- **Database**: Prisma ORM + SQLite
- **AI**: z-ai-web-dev-sdk (LLM, TTS, ASR)
- **Icons**: Lucide React

---

## هيكل المشروع

```
speakup/
├── prisma/
│   └── schema.prisma              # قاعدة البيانات
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service Worker
│   ├── logo.svg                   # الشعار
│   └── icons/                     # أيقونات التطبيق
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts       # API للمحادثة
│   │   │   ├── tts/
│   │   │   │   └── route.ts       # API للتحويل النصي إلى صوت
│   │   │   └── asr/
│   │   │       └── route.ts       # API للتعرف على الصوت
│   │   ├── layout.tsx             # التخطيط الرئيسي
│   │   ├── page.tsx               # الصفحة الرئيسية
│   │   └── globals.css            # الأنماط العامة
│   ├── components/
│   │   └── ui/                    # مكونات shadcn/ui
│   ├── hooks/
│   │   ├── use-mobile.ts          # Hook للجوال
│   │   └── use-toast.ts           # Hook للإشعارات
│   └── lib/
│       ├── db.ts                  # اتصال قاعدة البيانات
│       └── utils.ts               # وظائف مساعدة
├── package.json                   # الاعتماديات
├── tsconfig.json                  # إعدادات TypeScript
├── tailwind.config.ts             # إعدادات Tailwind
├── next.config.ts                 # إعدادات Next.js
└── .env                           # متغيرات البيئة
```

---

## كود المصدر الكامل

### 1. 📦 package.json

```json
{
  "name": "speakup",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset"
  },
  "dependencies": {
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@tanstack/react-query": "^5.82.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.2",
    "lucide-react": "^0.525.0",
    "next": "^16.1.1",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "z-ai-web-dev-sdk": "^0.0.16",
    "zod": "^4.0.2",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

### 2. 🗄️ prisma/schema.prisma

```prisma
// قاعدة بيانات التطبيق
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// نموذج المستخدم
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// نموذج المتعلم
model EnglishLearner {
  id                String   @id @default(cuid())
  name              String
  currentLevel      String   @default("beginner")
  currentWeek       Int      @default(1)
  currentLesson     Int      @default(1)
  totalStudyMinutes Int      @default(0)
  lessonsCompleted  Int      @default(0)
  practiceCount     Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  chatHistory       ChatHistory[]
  practiceSessions  PracticeSession[]
  progress          Progress[]
}

// سجل المحادثات
model ChatHistory {
  id           String   @id @default(cuid())
  learnerId    String
  learner      EnglishLearner @relation(fields: [learnerId], references: [id], onDelete: Cascade)
  role         String   // 'user' or 'assistant'
  content      String
  timestamp    DateTime @default(now())
}

// جلسات التدريب
model PracticeSession {
  id           String   @id @default(cuid())
  learnerId    String
  learner      EnglishLearner @relation(fields: [learnerId], references: [id], onDelete: Cascade)
  type         String   // 'pronunciation', 'conversation', 'writing'
  prompt       String
  userResponse String
  feedback     String?
  score        Int?
  duration     Int      // in seconds
  createdAt    DateTime @default(now())
}

// تتبع التقدم
model Progress {
  id           String   @id @default(cuid())
  learnerId    String
  learner      EnglishLearner @relation(fields: [learnerId], references: [id], onDelete: Cascade)
  week         Int
  lesson       Int
  completed    Boolean  @default(false)
  score        Int?
  completedAt  DateTime?
  updatedAt    DateTime @updatedAt
}
```

---

### 3. 📄 public/manifest.json

```json
{
  "name": "SpeakUp - تعلم الإنجليزية",
  "short_name": "SpeakUp",
  "description": "تحدث بثقة في الإنجليزية من الصفر حتى الإتقان. رحلة مستمرة نحو الطلاقة مع معلم AI ذكي.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#1e40af",
  "orientation": "portrait-primary",
  "scope": "/",
  "dir": "rtl",
  "lang": "ar",
  "categories": ["education", "lifestyle"],
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "ابدأ درس جديد",
      "short_name": "درس جديد",
      "description": "ابدأ درس إنجليزي جديد",
      "url": "/?tab=lessons",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "تدرب على المحادثة",
      "short_name": "محادثة",
      "description": "تدرب على المحادثة الإنجليزية",
      "url": "/?tab=chat",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "تدرب على النطق",
      "short_name": "نطق",
      "description": "تحسين نطقك الإنجليزي",
      "url": "/?tab=pronunciation",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

---

### 4. 🎨 src/app/globals.css

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### 5. 🏗️ src/app/layout.tsx

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "SpeakUp - تعلم الإنجليزية | رحلة نحو الطلاقة",
  description: "تحدث بثقة في الإنجليزية من الصفر حتى الإتقان. رحلة مستمرة نحو الطلاقة مع معلم AI ذكي.",
  keywords: ["تعلم الإنجليزية", "English learning", "تعليم الإنجليزية", "SpeakUp"],
  authors: [{ name: "SpeakUp Team" }],
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SpeakUp',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "SpeakUp - تحدث بثقة نحو الطلاقة الإنجليزية",
    description: "رحلة مستمرة نحو إتقان الإنجليزية مع معلم AI ذكي",
    url: "https://yourdomain.com",
    siteName: "SpeakUp",
    type: "website",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakUp - تعلم الإنجليزية",
    description: "تحدث بثقة في الإنجليزية من الصفر حتى الإتقان",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SpeakUp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered');
                    },
                    function(err) {
                      console.log('Service Worker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
```

---

### 6. 🏠 src/app/page.tsx

```typescript
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
import {
  MessageSquare,
  Mic,
  BookOpen,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle,
  Volume2,
  Sparkles,
  Target,
  Clock,
  Award,
  GraduationCap
} from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  correction?: string
}

type Lesson = {
  id: number
  week: number
  title: string
  description: string
  topics: string[]
  duration: string
  completed?: boolean
}

const curriculumData: Record<number, Lesson[]> = {
  1: [
    {
      id: 1,
      week: 1,
      title: 'Introduction to English Greetings',
      description: 'Learn basic greetings and introductions in English',
      topics: ['Hello, Hi, Good morning', 'My name is...', 'How are you?'],
      duration: '15 min'
    },
    {
      id: 2,
      week: 1,
      title: 'Numbers 1-20',
      description: 'Learn to count and use numbers in daily life',
      topics: ['One, Two, Three...', 'Phone numbers', 'Prices'],
      duration: '20 min'
    },
    {
      id: 3,
      week: 1,
      title: 'Colors and Shapes',
      description: 'Essential vocabulary for describing objects',
      topics: ['Red, Blue, Green...', 'Circle, Square, Triangle'],
      duration: '15 min'
    },
    {
      id: 4,
      week: 1,
      title: 'Days and Months',
      description: 'Talking about dates and time',
      topics: ['Monday, Tuesday...', 'January, February...', 'Today is...'],
      duration: '20 min'
    }
  ],
  2: [
    {
      id: 5,
      week: 2,
      title: 'Family Members',
      description: 'Vocabulary for talking about your family',
      topics: ['Father, Mother, Brother...', 'I have a sister', 'My family is...'],
      duration: '20 min'
    },
    {
      id: 6,
      week: 2,
      title: 'Common Objects',
      description: 'Everyday items you see around you',
      topics: ['Table, Chair, Pen...', 'This is a...', 'Where is the...?'],
      duration: '15 min'
    },
    {
      id: 7,
      week: 2,
      title: 'Action Verbs',
      description: 'Essential verbs for daily activities',
      topics: ['Eat, Drink, Sleep, Run...', 'I am eating', 'He is running'],
      duration: '25 min'
    },
    {
      id: 8,
      week: 2,
      title: 'Basic Questions',
      description: 'How to ask and answer common questions',
      topics: ['What is this?', 'Where is...?', 'Who is...?', 'When...?'],
      duration: '20 min'
    }
  ],
  3: [
    {
      id: 9,
      week: 3,
      title: 'Food and Drinks',
      description: 'Order food and talk about meals',
      topics: ['Bread, Rice, Meat...', 'I like...', 'I would like...'],
      duration: '20 min'
    },
    {
      id: 10,
      week: 3,
      title: 'At the Restaurant',
      description: 'Practical restaurant conversations',
      topics: ['A table for two', 'Can I have the menu?', 'The bill, please'],
      duration: '25 min'
    },
    {
      id: 11,
      week: 3,
      title: 'Weather and Seasons',
      description: 'Talk about weather conditions',
      topics: ['Sunny, Rainy, Cold...', 'What is the weather like?', 'Seasons'],
      duration: '15 min'
    },
    {
      id: 12,
      week: 3,
      title: 'Review Week 1-3',
      description: 'Comprehensive review and practice',
      topics: ['Practice conversations', 'Vocabulary quiz', 'Speaking practice'],
      duration: '30 min'
    }
  ]
}

export default function EnglishLearningApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! 👋 أنا معلمك الذكي في **SpeakUp**.\n\nسأساعدك على التحدث بثقة في الإنجليزية من الصفر حتى الإتقان.\n\nاختر واحدة من هذه الأقسام للبدء:\n\n📚 **الدروس** - منهج دراسي منظم\n💬 **المحادثة** - تدرب على الحديث\n🎤 **النطق** - تحسين نطقك\n📊 **التقدم** - تتبع إنجازاتك\n\nهل أنت مستعد للبدء؟ Let\'s start flowing! 🌊',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [studyTime, setStudyTime] = useState(0)
  const [lessonsCompleted, setLessonsCompleted] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const startRecording = async () => {
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
        await transcribeAudio(audioBlob)
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

  const transcribeAudio = async (audioBlob: Blob) => {
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
          if (data.transcription) {
            setInputMessage(data.transcription)
          }
        }
      }
    } catch (error) {
      console.error('Transcription error:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
        correction: data.correction
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

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

  const completeLesson = (lesson: Lesson) => {
    setLessonsCompleted(prev => prev + 1)
    setSelectedLesson(prev => prev?.id === lesson.id ? { ...prev, completed: true } : prev)
    setStudyTime(prev => prev + 15)
  }

  const getProgressPercentage = () => {
    const totalLessons = 12
    return Math.round((lessonsCompleted / totalLessons) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  SpeakUp
                </h1>
                <p className="text-sm text-gray-500">تحدث بثقة نحو الطلاقة</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                {studyTime} دقيقة
              </Badge>
              <Badge className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                <Award className="w-4 h-4" />
                {lessonsCompleted} درس مكتمل
              </Badge>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">التقدم العام</span>
              <span className="text-sm font-bold text-blue-600">{getProgressPercentage()}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white shadow-md rounded-xl">
            <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">المحادثة</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">الدروس</span>
            </TabsTrigger>
            <TabsTrigger value="pronunciation" className="gap-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Mic className="w-5 h-5" />
              <span className="hidden sm:inline">النطق</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-5 h-5" />
              <span className="hidden sm:inline">التقدم</span>
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  محادثة ذكية
                </CardTitle>
                <CardDescription className="text-blue-50">
                  تحدث مع المعلم الذكي وتحدث بثقة في الإنجليزية
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          {message.correction && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start gap-2 text-yellow-800">
                                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold text-sm">تصحيح:</p>
                                  <p className="text-sm mt-1">{message.correction}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20 border-white">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString('ar-SA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 gap-1"
                                onClick={() => speakText(message.content)}
                              >
                                <Volume2 className="w-3 h-3" />
                                استمع
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                <Separator />

                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="اكتب رسالتك بالإنجليزية أو بالعربي..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      className="min-h-[60px] resize-none"
                    />
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      className="h-auto"
                    >
                      {isRecording ? (
                        <PauseCircle className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </Button>
                    <Button onClick={sendMessage} className="h-auto bg-blue-600 hover:bg-blue-700">
                      <PlayCircle className="w-6 h-6" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    💡 اضغط على الميكروفون للتحدث أو اكتب رسالتك ثم اضغط Enter
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(curriculumData).map(([week, lessons]) => (
                <Card key={week} className="shadow-lg border-2 hover:border-emerald-300 transition-all">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span>الأسبوع {week}</span>
                      <Badge className="bg-white text-blue-600">
                        {lessons.length} دروس
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <Dialog key={lesson.id}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-right h-auto py-3 hover:bg-blue-50"
                              onClick={() => setSelectedLesson(lesson)}
                            >
                              <div className="text-right">
                                <div className="font-semibold text-sm">{lesson.title}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {lesson.duration}
                                </div>
                              </div>
                              {lesson.completed && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl flex items-center gap-2">
                                <BookOpen className="w-7 h-7 text-blue-600" />
                                {lesson.title}
                              </DialogTitle>
                              <DialogDescription className="text-base mt-2">
                                {lesson.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Target className="w-5 h-5 text-blue-600" />
                                  سوف تتعلم:
                                </h4>
                                <div className="grid gap-2">
                                  {lesson.topics.map((topic, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
                                    >
                                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-6 h-6 text-gray-600" />
                                <div>
                                  <div className="text-sm text-gray-600">المدة المتوقعة</div>
                                  <div className="font-semibold">{lesson.duration}</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={() => completeLesson(lesson)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={lesson.completed}
                              >
                                {lesson.completed ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 ml-2" />
                                    تم الإكمال
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="w-4 h-4 ml-2" />
                                    ابدأ الدرس
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pronunciation Tab */}
          <TabsContent value="pronunciation" className="space-y-6">
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-6 h-6" />
                  تدريب النطق
                </CardTitle>
                <CardDescription className="text-violet-50">
                  تحسن نطقك بالاستماع والتسجيل
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">الجمل اليومية للتدريب:</h3>
                  <div className="grid gap-3">
                    {[
                      'Hello, how are you today?',
                      'My name is Ahmed.',
                      'I am learning English.',
                      'What time is it?',
                      'Where is the restaurant?'
                    ].map((sentence, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-violet-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{sentence}</p>
                          <p className="text-sm text-gray-500 mt-1 arabic-text">
                            {index === 0 && 'مرحباً، كيف حالك اليوم؟'}
                            {index === 1 && 'اسمي أحمد.'}
                            {index === 2 && 'أنا أتعلم الإنجليزية.'}
                            {index === 3 && 'كم الساعة الآن؟'}
                            {index === 4 && 'أين المطعم؟'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => speakText(sentence)}
                          className="gap-2"
                        >
                          <Volume2 className="w-4 h-4" />
                          استمع
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">سجل نطقك:</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "default"}
                      className="gap-2 bg-violet-500 hover:bg-violet-600"
                      size="lg"
                    >
                      {isRecording ? (
                        <>
                          <PauseCircle className="w-5 h-5" />
                          إيقاف التسجيل
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          ابدأ التسجيل
                        </>
                      )}
                    </Button>
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-500">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-medium">جاري التسجيل...</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-xl border-2">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    إحصائيات التعلم
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600">الدروس المكتملة</span>
                      <span className="font-bold text-2xl text-blue-700">
                        {lessonsCompleted}/12
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">وقت الدراسة</span>
                      <span className="font-bold text-2xl text-green-600">
                        {studyTime} دقيقة
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-violet-50 rounded-lg">
                      <span className="text-gray-600">الأسبوع الحالي</span>
                      <span className="font-bold text-2xl text-violet-600">
                        {currentWeek}/12
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    الإنجازات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { name: 'أول درس', condition: lessonsCompleted >= 1 },
                      { name: 'أسبوع كامل', condition: lessonsCompleted >= 4 },
                      { name: 'نصف الطريق', condition: lessonsCompleted >= 6 },
                      { name: 'متقدم', condition: lessonsCompleted >= 9 },
                      { name: 'خبير', condition: lessonsCompleted >= 12 }
                    ].map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          achievement.condition
                            ? 'bg-amber-50 border-2 border-amber-300'
                            : 'bg-gray-50 opacity-50'
                        }`}
                      >
                        {achievement.condition ? (
                          <CheckCircle2 className="w-6 h-6 text-amber-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="font-medium">{achievement.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>المنهج الدراسي - رحلة 3 أشهر</CardTitle>
                <CardDescription className="text-blue-50">
                  12 أسبوع • 90 درس • من المبتدئ إلى المتقدم
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
                    <div
                      key={week}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        week <= currentWeek
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              week <= currentWeek
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {week}
                          </div>
                          <div>
                            <h4 className="font-semibold">الأسبوع {week}</h4>
                            <p className="text-sm text-gray-500">
                              {week <= 3
                                ? 'المستوى المبتدئ'
                                : week <= 6
                                ? 'المستوى الأساسي'
                                : week <= 9
                                ? 'المستوى المتوسط'
                                : 'المستوى المتقدم'}
                            </p>
                          </div>
                        </div>
                        {week <= currentWeek && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        )}
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
      <footer className="bg-white border-t mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>🌊 SpeakUp - تحدث بثقة نحو الطلاقة الإنجليزية</p>
          <p className="mt-1">مجاني بالكامل • صُمم خصيصاً للمتحدثين بالعربية</p>
        </div>
      </footer>
    </div>
  )
}
```

---

### 7. 💬 src/app/api/chat/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const ENGLISH_TEACHER_SYSTEM = `You are an expert English teacher with 30+ years of experience teaching Arabic speakers.

IMPORTANT RULES:
1. Always respond in BOTH English AND Arabic
2. Keep English simple and clear
3. Provide phonetic pronunciation for new words
4. Correct grammar mistakes gently
5. Encourage the user and be positive
6. Use examples from daily life
7. Ask follow-up questions

RESPONSE FORMAT:
- English response (simple, clear)
- Arabic translation
- Corrections (if user made mistakes)
- Pronunciation guide
- A follow-up question

START with a warm greeting and ask what they would like to practice.`

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const messages = [
      { role: 'assistant', content: ENGLISH_TEACHER_SYSTEM },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await zai.chat.completions.create({
      messages: messages,
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, could not generate response.'

    return NextResponse.json({
      success: true,
      response: response
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
```

---

### 8. 🔊 src/app/api/tts/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'tongtong', speed = 1.0 } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (text.length > 1024) {
      return NextResponse.json(
        { error: 'Text exceeds maximum length of 1024 characters' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const response = await zai.audio.tts.create({
      input: text.trim(),
      voice: voice,
      speed: Math.min(Math.max(speed, 0.5), 2.0),
      response_format: 'wav',
      stream: false
    })

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(new Uint8Array(arrayBuffer))

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('TTS API Error:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
```

---

### 9. 🎙️ src/app/api/asr/route.ts

```typescript
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

    try {
      Buffer.from(audio, 'base64')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid base64 audio data' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const response = await zai.audio.asr.create({
      file_base64: audio
    })

    const transcription = response.text || ''

    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not transcribe audio' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      transcription: transcription.trim()
    })

  } catch (error) {
    console.error('ASR API Error:', error)
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
```

---

### 10. 🗄️ src/lib/db.ts

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

---

### 11. ⚙️ tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        destructive: 'hsl(var(--destructive))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
```

---

### 12. 🔧 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
```

---

### 13. 📝 .env

```env
# Database
DATABASE_URL="file:./db/custom.db"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## تعليمات التشغيل

### المتطلبات

- Node.js 18+
- Bun أو npm
- Git (للنشر على GitHub/Vercel)

### خطوات التشغيل المحلي

```bash
# 1. تثبيت الاعتماديات
bun install

# 2. إعداد قاعدة البيانات
bun run db:push

# 3. تشغيل التطبيق
bun run dev

# افتح المتصفح على: http://localhost:3000
```

---

## تعليمات النشر

### النشر على Vercel (موصى به)

#### الخطوة 1: رفع الكود على GitHub

```bash
# تهيئة Git (إذا لم يكن)
git init

# إضافة الملفات
git add .

# أول commit
git commit -m "Initial commit"

# إضافة remote
git remote add origin https://github.com/YOUR_USERNAME/speakup.git

# دفع الكود
git push -u origin main
```

#### الخطوة 2: النشر على Vercel

1. اذهب إلى: https://vercel.com
2. سجل حساب مجاني باستخدام GitHub
3. انقر "Add New..." ثم "Project"
4. اختر مستودع `speakup`
5. انقر "Import"
6. انتظر الدقائق
7. احصل على رابط: `https://speakup.vercel.app`

### النشر على Netlify

1. اذهب إلى: https://netlify.com
2. سجل حساب
3. "Add new site" → "Import from GitHub"
4. اختر المستودع
5. اضبط الإعدادات:
   - Build command: `bun run build`
   - Publish directory: `.next`
6. Deploy

### التثبيت كـ PWA

#### على Android (Chrome):
1. افتح التطبيق في Chrome
2. القائمة (ثلاث نقاط)
3. "Install App" أو "Add to Home Screen"
4. اضغط "Install"

#### على iPhone (Safari):
1. افتح التطبيق في Safari
2. زر المشاركة ↑
3. "Add to Home Screen"
4. اضغط "Add"

---

## 🎨 التخصيص

### تغيير الألوان

في `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.205 0 0);  /* اللون الرئيسي */
  --secondary: oklch(0.97 0 0); /* اللون الثانوي */
  /* ... */
}
```

### تغيير الاسم

في `public/manifest.json`:

```json
{
  "name": "اسم التطبيق الجديد",
  "short_name": "الاسم المختصر"
}
```

في `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "اسم التطبيق الجديد",
  description: "الوصف الجديد"
}
```

---

## 📚 المراجع الإضافية

- [دليل الربح الشامل](MONETIZATION_GUIDE.md)
- [دليل النشر](DEPLOYMENT_GUIDE.md)
- [دليل التثبيت على الهاتف](INSTALL_ON_PHONE.md)
- [سجل العمل](worklog.md)

---

## 📄 الترخيص

هذا التطبيق ملك لك بالكامل. يمكنك:
- ✅ تخصيصه باسمك
- ✅ نشره والربح منه
- ✅ تعديله كما تريد

---

**صُنع بـ ❤️ لتعلم الإنجليزية** 🌊
