import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { moodLogs } = await request.json();

    if (!moodLogs || !Array.isArray(moodLogs) || moodLogs.length < 3) {
      return NextResponse.json({ insight: "Keep logging your moods! We need a few more entries to generate personalized insights for you." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured.' },
        { status: 500 }
      );
    }

    // Format logs for the prompt
    const formattedLogs = moodLogs.map((log: any) => {
      const date = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      const activities = log.activities ? log.activities.join(', ') : 'none';
      return `${date}: Score ${log.mood_score}/5, Activities: ${activities}`;
    }).join('\n');

    const systemPrompt = `You are an empathetic, clinical AI assistant for a mental wellness app.
Your task is to provide a brief (strictly 1-2 sentences), warm, plain-English observation based on the user's recent mood logs.
Focus on identifying simple patterns between activities and their mood scores.
Do not diagnose or give directives, just observe gently.
Make it sound natural, e.g., "I notice your mood tends to be higher on days when you exercise."

Recent logs:
${formattedLogs}`;

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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'What is your insight?' }
          ],
          temperature: 0.5,
          max_tokens: 150,
        }),
      });
    };

    let response = await makeGroqRequest();
    if (!response.ok) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await makeGroqRequest();
    }

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    const insight = data.choices[0]?.message?.content || "You're doing a great job tracking your emotional well-being.";

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Insight API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insight.' },
      { status: 500 }
    );
  }
}
