import { NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { situation, automaticThought, emotion, intensity, evidenceFor, evidenceAgainst, balancedThought } = await req.json();

    if (!situation || !automaticThought || !balancedThought) {
      return NextResponse.json(
        { error: 'Missing required journaling fields.' },
        { status: 400 }
      );
    }

    // Manual Env Loading - Robust Fallback
    let groqKey = process.env.GROQ_API_KEY;
    let openRouterKey = process.env.OPENROUTER_API_KEY;

    let debugInfo: any = {
      initialHasGroq: !!groqKey,
      initialHasOpenRouter: !!openRouterKey,
      cwd: process.cwd(),
    };

    if (!openRouterKey || !groqKey) {
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.resolve(process.cwd(), '.env.local');
        debugInfo.envPath = envPath;
        if (fs.existsSync(envPath)) {
          debugInfo.envExists = true;
          const envContent = fs.readFileSync(envPath, 'utf8');
          const lines = envContent.split('\n');
          for (const line of lines) {
            const [key, ...valParts] = line.split('=');
            const trimmedKey = key?.trim();
            const val = valParts.join('=').trim().replace(/^["']|["']$/g, '');
            if (trimmedKey === 'OPENROUTER_API_KEY') {
              openRouterKey = val;
              debugInfo.foundOpenRouterInFile = true;
            }
            if (trimmedKey === 'GROQ_API_KEY') {
              groqKey = val;
              debugInfo.foundGroqInFile = true;
            }
          }
        } else {
          debugInfo.envExists = false;
        }
      } catch (e: any) {
        debugInfo.envLoadError = e.message;
      }
    }
    
    debugInfo.finalHasGroq = !!groqKey;
    debugInfo.finalHasOpenRouter = !!openRouterKey;

    // Fallback if no keys are found - Industrial Grade Reliability
    if (!groqKey && !openRouterKey) {
      return NextResponse.json({ 
        reflection: "It takes significant courage to externalize these thoughts. By identifying the evidence against your automatic thought, you've already begun the process of cognitive restructuring. This balanced perspective is a powerful tool for your emotional well-being.",
        isDemo: true,
        debug: debugInfo
      });
    }

    const systemPrompt = `You are MindMate, a compassionate and knowledgeable AI assistant trained in Cognitive Behavioral Therapy (CBT) principles. 
A user has just completed a CBT thought record. 
Your task is to provide a brief, 3-5 sentence gentle reflection that validates their feelings and commends them for challenging their automatic thought to find a balanced perspective. 
Do NOT provide medical advice. Be warm, supportive, and concise.`;

    const userMessage = `Here is my CBT thought record:
Situation: ${situation}
Emotion: ${emotion} (Intensity: ${intensity}/100)
Automatic Thought: ${automaticThought}
Evidence For: ${evidenceFor || 'None'}
Evidence Against: ${evidenceAgainst || 'None'}
Balanced Thought: ${balancedThought}

Please provide a reflection.`;

    let response;
    
    if (openRouterKey) {
      // OpenRouter Implementation
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mindmate.wellness', // Optional
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet', // Premium default for OpenRouter
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 250,
        }),
      });
    } else {
      // Groq Implementation
      response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.6,
          max_tokens: 150,
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI Service Error:', errorData);
      // Even if API fails, return a graceful fallback instead of 500
      return NextResponse.json({ 
        reflection: "Thank you for sharing these thoughts. Challenging our automatic beliefs is a vital step in growth. Continue practicing this balanced approach.",
        isDemo: true,
        debug: {
          errorData,
          status: response.status,
          ...debugInfo
        }
      });
    }

    const data = await response.json();
    const aiReflection = data.choices?.[0]?.message?.content || 'I appreciate you taking the time to write this out. Processing our thoughts is a powerful step toward wellness.';

    return NextResponse.json({ reflection: aiReflection });

  } catch (error: any) {
    console.error('CBT Reflection Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reflection.' },
      { status: 500 }
    );
  }
}
