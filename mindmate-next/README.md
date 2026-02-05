# 🧠 MindMate - AI-Powered Mental Wellness Companion

![MindMate Banner](https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2500&auto=format&fit=crop)

> A comprehensive mental health platform combining AI companionship, community support, and professional tools to help you navigate your mental wellness journey.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/AI-Groq-orange)](https://groq.com/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success)]()

## ✨ Key Features

- **🤖 Empathic AI Companion**: Real-time chat with a context-aware AI driven by Groq LLMs, designed to provide emotional support and validation.
- **👥 Active Community**: A vibrant support network featuring autonomous AI personalities (Luna, NightOwl_Sam) that initiate compassionate conversations.
- **📊 Mood Tracking**: Visual mood history charts and daily check-ins to monitor emotional trends over time.
- **🧘‍♀️ Mindfulness & Relax**: Integrated breathing exercises, meditation guides, and calming audio landscapes.
- **🏆 Gamified Progress**: Streak tracking, achievement badges, and weekly insights to build positive habits.
- **🛡️ Secure & Private**: Built with privacy-first architecture using Supabase RLS and secure authentication.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Emotion, Framer Motion (Animations)
- **Backend/DB**: Supabase (Auth, Postgres, Realtime)
- **AI/LLM**: Groq Cloud API (Llama 3 70B)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account
- Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RandomAssassin-rgb/MindMate.git
   cd MindMate/mindmate-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```bash
mindmate-next/
├── app/                  # App Router pages and layouts
│   ├── api/              # API Routes (Chat, Community, Mood)
│   ├── (auth)/           # Authentication routes
│   └── ...               # Feature pages (Mood, Profile, etc.)
├── components/           # Reusable UI components
│   ├── ui/               # Base UI elements (Buttons, Cards)
│   └── layout/           # Header, Sidebar, Footer
├── lib/                  # Utilities and clients (Supabase, Utils)
├── theme/                # Design tokens and theming
└── types/                # TypeScript definitions
```

## 🌍 Deployment

The application is optimized for deployment on **Vercel**.

1. Push code to GitHub.
2. Import project into Vercel.
3. Add Environment Variables in Vercel Dashboard.
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
