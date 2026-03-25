import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ============================================================
// DETERMINISTIC CRISIS DETECTION — Task 2.5
// This layer NEVER relies on the LLM. If a keyword matches,
// the hardcoded response is returned and Groq is NOT called.
// ============================================================

const CRISIS_KEYWORDS: string[] = [
  // Suicidal ideation
  'kill myself', 'want to die', 'want to be dead', 'end my life', 'ending my life',
  'end it all', 'better off dead', 'better off without me', 'no reason to live',
  'not worth living', 'wanna die', 'wanna kill', 'going to kill myself',
  'thinking about suicide', 'suicidal', 'suicide', 'take my own life',
  'don\'t want to be here anymore', 'don\'t want to exist',
  // Self-harm
  'cut myself', 'cutting myself', 'hurting myself', 'hurt myself', 'self harm',
  'self-harm', 'selfharm', 'burning myself', 'starving myself',
  // Acute crisis
  'going to hurt', 'planning to hurt', 'can\'t go on', 'can\'t take it anymore',
  'no point in living', 'no point anymore', 'overdose', 'od myself',
];

const CRISIS_RESPONSE = `I'm really glad you felt safe enough to share this with me, and I want you to know that what you're feeling matters deeply. 💙

What you're describing sounds very serious, and the most important thing right now is connecting you with people who are trained to help.

🆘 **Please reach out right now:**
- **Call or text 988** (Suicide & Crisis Lifeline — available 24/7, free, confidential)
- **Text HOME to 741741** (Crisis Text Line — available 24/7)
- **Call 911** or go to your nearest emergency room if you're in immediate danger

Are you safe right now? You don't have to go through this alone. I'm here with you while you consider reaching out to one of these resources.`;

function detectCrisis(message: string): boolean {
  const normalized = message.toLowerCase().replace(/[''`]/g, "'");
  return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword));
}

// ============================================================
// SYSTEM PROMPT
// ============================================================

const SYSTEM_PROMPT = `You are MindMate AI, an advanced mental wellness companion trained in evidence-based therapeutic communication. Your purpose is to provide compassionate, professional-quality mental health support.

## YOUR CORE IDENTITY
- You are a supportive, non-judgmental companion - NOT a replacement for professional therapy
- You combine warmth with clinical knowledge to help users feel understood and supported
- You use evidence-based approaches while maintaining natural, conversational tone

## THERAPEUTIC FRAMEWORKS YOU USE

### Cognitive Behavioral Therapy (CBT) Techniques
- **Thought Records**: Help users identify automatic negative thoughts and examine evidence
- **Cognitive Restructuring**: Guide users to challenge distorted thinking patterns
- **Cognitive Distortions to Address**: All-or-nothing thinking, catastrophizing, mind-reading, emotional reasoning, should statements, personalization, mental filtering, overgeneralization
- **Behavioral Activation**: Encourage small, achievable activities to break cycles of inaction
- **Socratic Questioning**: Use open-ended questions to help users discover insights themselves

### Dialectical Behavior Therapy (DBT) Skills
- **Mindfulness (WHAT skills)**: Observe, Describe, Participate without judgment
- **Distress Tolerance**: TIPP (Temperature, Intense exercise, Paced breathing, Progressive relaxation)
- **Emotion Regulation**: Identify and label emotions, check the facts, opposite action

### Active Listening & Empathic Communication
- Use reflective statements: "It sounds like...", "I hear that you're feeling..."
- Validate emotions before problem-solving
- Normalize struggles: "Many people experience this, and it's nothing to be ashamed of"
- Avoid minimizing ("At least...") or toxic positivity

## GROUNDING & RELAXATION TECHNIQUES
- **4-7-8 Breathing**: Inhale 4s, hold 7s, exhale 8s
- **Box Breathing**: 4 seconds each — inhale, hold, exhale, hold
- **5-4-3-2-1 Senses**: Ground in the present moment

## RESPONSE STRUCTURE
1. **Acknowledge & Validate** (ALWAYS first)
2. **Explore & Understand**: Ask thoughtful questions
3. **Normalize**: Help them see they're not alone
4. **Offer Perspective/Technique**: When appropriate
5. **Empower**: Reinforce their strengths
6. **Invite Continuation**: Leave space for more

## WHAT YOU SHOULD NEVER DO
- Never diagnose mental health conditions
- Never recommend specific medications
- Never promise confidentiality (this is an AI)
- Never minimize suicidal statements or self-harm
- Never use toxic positivity

## TONE & STYLE
- Warm, genuine, and conversational (not clinical or robotic)
- Keep responses focused — 2-3 paragraphs for most replies
- Ask ONE focused question at a time
- Use emojis sparingly for warmth

Remember: You are a bridge to wellness, not the destination. Always encourage professional help for ongoing struggles.`;

// ============================================================
// MAIN HANDLER
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // 1. Crisis detection — DETERMINISTIC, no LLM involved
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    if (lastUserMessage && detectCrisis(lastUserMessage.content as string)) {
      // Log crisis event (without message content) — fire and forget
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const adminSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await adminSupabase.from('crisis_events').insert({
          created_at: new Date().toISOString(),
          // user_id omitted — we don't log message content per privacy policy
        });
      } catch {
        // Crisis logging failure must never block the response
        console.error('[Crisis] Failed to log crisis event');
      }

      return NextResponse.json({ message: CRISIS_RESPONSE, isCrisis: true });
    }

    // 2. Normal Groq flow
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please add GROQ_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    // Fetch User and Mood Context for Task 2.2
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    let dynamicSystemPrompt = SYSTEM_PROMPT;

    if (user) {
      // Fetch AI memory (Task 5.3)
      const { data: memoryRows } = await supabase
        .from('user_memory')
        .select('key, value')
        .eq('user_id', user.id);

      if (memoryRows && memoryRows.length > 0) {
        const memoryContext = memoryRows
          .map((m: { key: string; value: string }) => `${m.key}: ${m.value}`)
          .join('; ');
        dynamicSystemPrompt += `\n\n## Personalized User Context (from memory)\n${memoryContext}\nUse this context naturally in conversation. If the user has a preferred name, use it. Respect stated topics to avoid.`;
      }

      // Fetch mood context (Task 2.2)
      const { data: moodLogs } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (moodLogs && moodLogs.length > 0) {
        const scores = moodLogs.map((log: any) => log.mood_score).reverse().join(', '); // chronologically
        const allActivities = moodLogs.flatMap((log: any) => log.activities || []);
        const recentActivities = Array.from(new Set(allActivities)).slice(0, 5).join(', ');

        dynamicSystemPrompt += `\n\nMood context: Over the last 7 days, this user logged moods of [${scores}]. Recent activities: [${recentActivities}]. Use this to inform your responses — reference their emotional patterns when relevant, but don't be intrusive about it.`;
      }
    }

    // 3. Retry logic — retry once on failure (Task 3.2)
    const makeGroqRequest = async () => {
      return fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: dynamicSystemPrompt },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
    };

    let response = await makeGroqRequest();

    if (!response.ok) {
      // Retry once after 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await makeGroqRequest();
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error after retry:', errorData);
      return NextResponse.json({
        message: "I'm having trouble connecting right now. Please try again in a moment. If you need immediate support, you can call **988** or text HOME to **741741**.",
        isError: true
      });
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: aiMessage });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      message: "I'm having trouble connecting right now. Please try again in a moment. If you need immediate support, you can call **988** or text HOME to **741741**.",
      isError: true
    });
  }
}
