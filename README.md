# MindMate AI Powered Mental Wellness Companion

> **MindMate** is an AI-assisted mental wellness platform designed to support emotional wellbeing through intelligent conversation, self-reflection tools, and community interaction built with modern full-stack technologies and privacy-first principles.

## Overview

MindMate combines **AI companionship, emotional tracking, and guided wellness tools** into a single platform.
It aims to provide accessible mental wellness support while maintaining user privacy and data security.

This project is a wellness support tool not a substitute for professional medical care.

## Core Features

### AI Companion

* Context-aware conversational AI powered by Groq LLMs
* Emotionally supportive responses designed for wellness contexts
* Continuous conversation memory for better personalization

### Community Support

* AI-augmented community interaction
* Supportive discussion environment
* Autonomous AI personalities to encourage engagement

### Mood Tracking and Insights

* Daily mood check-ins
* Visual emotional trend analysis
* Habit-building streak system

### Wellness Toolkit

* Guided breathing exercises
* Meditation resources
* Relaxation audio environments

### Gamified Growth

* Achievement badges
* Positive habit streak tracking
* Weekly self-reflection insights

### Privacy Focused Architecture

* Supabase Row Level Security (RLS)
* Secure authentication workflows
* Minimal sensitive data exposure

## Tech Stack

### Frontend

* **Next.js 14 (App Router)**
* React and TypeScript
* Tailwind CSS
* Framer Motion animations

### Backend and Data

* Supabase (Postgres, Auth, Realtime)
* Secure API routes via Next.js

### AI Integration

* Groq Cloud API
* Llama 3 70B model support

### Deployment

* Vercel recommended

## Getting Started

### Prerequisites

* Node.js 18+
* Supabase account
* Groq API key

### Installation

1. Clone the repository

```
git clone https://github.com/RandomAssassin-rgb/MindMate.git
cd MindMate/mindmate-next
```

2. Install dependencies

```
npm install
```

3. Configure environment variables
   Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

4. Start development server

```
npm run dev
```

Visit:

```
http://localhost:3000
```

## Project Structure

```
mindmate-next/
│
├── app            App Router pages and API routes
├── components     UI and layout components
├── lib            Utilities and service clients
├── theme          Design tokens and styling config
└── types          TypeScript definitions
```

## Deployment Recommended Vercel

1. Push repository to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Done

## Contributing

Contributions are welcome.

Typical workflow:

```
fork → branch → commit → pull request
```

Please:

* Write clear commit messages
* Keep code consistent
* Add documentation when needed

## License

MIT License free for personal and commercial use.

## Why This Project Matters

Mental wellness tools are often:

* Fragmented
* Expensive
* Not privacy-focused

MindMate explores how **AI and modern web tech** can create accessible emotional wellness support responsibly.


