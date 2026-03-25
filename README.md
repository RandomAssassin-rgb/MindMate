<div align="center">

<img src="https://img.shields.io/badge/MindMate-Mental%20Wellness-0D7377?style=for-the-badge&logoColor=white" alt="MindMate" />

# 🧠 MindMate

### AI-Powered Mental Wellness Companion

**Talk. Track. Heal. Grow.**

Your 24/7 mental wellness partner — combining a high-fidelity **Claude 3.5 Sonnet** AI companion, mood analytics, guided meditation, clinical assessments, and real-time community support in a single privacy-first platform.

<br />

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mindmate--hazel.vercel.app-0D7377?style=for-the-badge&logo=vercel&logoColor=white)](https://mindmate-hazel.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

<br />

> ⚠️ **MindMate is a wellness support tool — not a substitute for professional medical care.**
> If you are in crisis, please call **iCall: 9152987821** or **Vandrevala Foundation: 1860-2662-345** (India) immediately.

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Security & Privacy](#-security--privacy)
- [License](#-license)

---

## 🌟 Overview

Mental wellness tools are often fragmented, expensive, or culturally disconnected. MindMate is built to fix that.

It combines an **Emotionally Intelligent AI** powered by Claude 3.5 Sonnet, a **mood tracking engine** with longitudinal insights, a **guided meditation library with real audio**, **validated clinical screenings** (PHQ-9, GAD-7), and a **CBT journaling tool** — all wrapped in a privacy-first architecture with Supabase Row Level Security at its core.

MindMate is designed for students and young adults to build resilience and manage mental health in a safe, judgment-free space.

```
The goal of MindMate is not to keep you on the app.
It's to help you build enough resilience that you need it less.
```

---

## ✨ Features

### 🤖 AI Companion
- **High-Fidelity Intelligence**: Conversations powered by **OpenRouter (Claude 3.5 Sonnet)** with a **Groq (Llama 3)** fallback layer for 100% uptime.
- **Context-aware persistence**: AI remembers your history and references previous conversations to provide tailored support.
- **Mood-aware responses**: AI factors in your recent emotional patterns and assessments before responding.
- **Deterministic crisis detection**: Hardcoded safety layer for crisis indicators, bypassing LLM logic for instant emergency resource routing.

### 📊 Mood Tracking & Insights
- **Daily Check-ins**: Log moods with activity correlation tags.
- **Visual Analytics**: 7-day and 30-day interactive charts powered by Recharts.
- **Smart Insights**: Automated patterns detection linking activities to emotional states.

### 🧘 Wellness Toolkit
- **Guided Breathing**: Interactive animations for Box Breathing, 4-7-8, and more.
- **Audio Sessions**: Real, high-quality audio sessions for Sleep, Meditation, and Nature Sounds.
- **CBT Journaling**: Structured cognitive reframing tool to help challenge negative thought patterns.

### 🩺 Clinical Tools
- **PHQ-9 & GAD-7**: Validated clinical assessments with automated scoring and historical tracking.
- **Progress Export**: Generate PDF clinical summaries of your progress to share with therapists.

### 🔒 Privacy & Security
- **Supabase RLS**: Row Level Security ensures only you can access your data.
- **No Data Training**: Your personal conversations are never used to train AI models.
- **Secure Auth**: Industry-standard Google OAuth and Email/Password integration.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Emotion/Styled Components + Tailwind CSS |
| **Animations** | GSAP + Framer Motion |
| **Backend & DB** | Supabase (Postgres + Auth + Realtime) |
| **AI / LLM** | OpenRouter (Claude 3.5 Sonnet) / Groq Llama 3 |
| **Charts** | Recharts |
| **PWA** | Next-PWA for offline and mobile installation |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
MindMate/
│
├── mindmate-next/                  # ✅ Active codebase (Next.js 14)
│   ├── app/                        # App Router — pages and API routes
│   │   ├── chat/                   # AI companion ( Claude 3.5 Sonnet)
│   │   ├── mood/                   # Mood tracking & Recharts dashboard
│   │   ├── relax/                  # Meditation library with Audio
│   │   ├── learn/                  # Content library + CBT journal
│   │   ├── assessments/            # PHQ-9 and GAD-7
│   │   └── api/                    # AI & Database Proxy routes
│   ├── components/                 # Styled Components library
│   ├── lib/                        # Supabase & OpenRouter/Groq clients
│   └── theme/                      # Design system tokens
│
├── legacy-v1/                      # 📦 Archived vanilla prototype
├── SECURITY.md                     # RLS policy documentation
└── README.md                       # You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- A [Supabase](https://supabase.com) account
- An [OpenRouter](https://openrouter.ai) or [Groq](https://console.groq.com) API key

### 1. Clone & Install

```bash
git clone https://github.com/RandomAssassin-rgb/MindMate.git
cd MindMate/mindmate-next
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

### 3. Initialize Database

Apply the SQL migration scripts found in the root directory via the Supabase SQL Editor:
- `supabase_forum_posts.sql`
- `supabase_cbt_journal.sql`
- `supabase_assessments.sql`
- `supabase_chat_history.sql`

### 4. dev

```bash
npm run dev
```

---

## 🔑 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# AI Providers
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗺 Roadmap

- [x] AI companion with Claude 3.5 Sonnet
- [x] Persistent chat history (Supabase)
- [x] Mood tracking with Recharts
- [x] Meditation library with actual Audio
- [x] Clinical Assessments (PHQ-9/GAD-7)
- [x] CBT Journaling Tool
- [x] Mobile PWA Support
- [x] Community Forum Feed
- [ ] Voice journaling with Whisper transcription
- [ ] Weekly Insight Report email delivery
- [ ] Therapist marketplace integration
- [ ] Multilingual support (Tamil, Hindi, Telugu)

---

## 📄 License

MIT License — see [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with care for mental wellness 🌿

[mindmate-hazel.vercel.app](https://mindmate-hazel.vercel.app)

</div>
