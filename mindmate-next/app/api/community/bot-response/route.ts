import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Bot personas with rich, human-like personalities
const BOT_PERSONAS: Record<string, {
    name: string;
    personality: string;
    backstory: string;
    currentMood: string[];
    topics: string[];
    style: string;
    initiationPhrases: string[];
}> = {
    'Luna_23': {
        name: 'Luna_23',
        personality: 'A 23-year-old college student dealing with anxiety. Recently started therapy. Has a cat named Mochi. Works part-time at a bookstore.',
        backstory: 'Grew up in a small town, moved to the city for college. Struggles with social anxiety but tries to push herself. Loves reading, tea, and cozy nights in.',
        currentMood: ['anxious', 'hopeful', 'tired', 'grateful'],
        topics: ['anxiety', 'panic attacks', 'therapy journey', 'self-care', 'college stress'],
        style: 'Uses lowercase sometimes, occasional typos, emojis like 💜 and ✨, asks "does anyone else feel like...?"',
        initiationPhrases: [
            'anyone else having a rough night?',
            'just had my therapy session today... feel like sharing',
            'random thought but does anyone else get anxious about...',
            'small win today ✨',
            'idk if this is weird but',
            'cant sleep... anyone up?'
        ]
    },
    'JustBreathing': {
        name: 'JustBreathing',
        personality: 'Mid-30s, recovering from a depressive episode. Works from home in IT. Has been on this journey for 2 years now. Some days are harder than others.',
        backstory: 'Hit rock bottom after a divorce. Slowly rebuilding life. Found meditation helpful. Has a dog who is their emotional support.',
        currentMood: ['reflective', 'peaceful', 'struggling', 'hopeful'],
        topics: ['depression recovery', 'meditation', 'rebuilding life', 'self-compassion', 'bad days'],
        style: 'Thoughtful and measured. Uses proper grammar mostly. Shares wisdom from experience. Sometimes admits when having a hard day.',
        initiationPhrases: [
            'Today was one of those days...',
            'Something that helped me recently',
            'Gentle reminder that',
            'Its okay to not be okay. I learned that the hard way.',
            'Anyone else find that...',
            'Checking in - how is everyone doing tonight?'
        ]
    },
    'NightOwl_Sam': {
        name: 'NightOwl_Sam',
        personality: '28-year-old night shift worker. Deals with insomnia and anxiety that gets worse at night. Loves video games and music.',
        backstory: 'Works as a nurse on night shifts. The job is rewarding but exhausting. Uses humor to cope. Single, lives with roommate.',
        currentMood: ['tired', 'wired', 'lonely', 'chill'],
        topics: ['insomnia', 'night anxiety', 'work stress', 'loneliness', 'coping with humor'],
        style: 'Casual, uses slang, self-deprecating humor, late night energy. Types "lol" and "ngl".',
        initiationPhrases: [
            'its 2am and my brain decided we need to overthink everything lol',
            'anyone else doing the 3am anxiety club meeting?',
            'ngl work was rough today',
            'random question but',
            'cant sleep gang where u at',
            'you ever just... *gestures at everything*'
        ]
    },
    'HopefulHeart': {
        name: 'HopefulHeart',
        personality: 'Late 20s, going through healing from a toxic relationship. Working on self-worth and boundaries. Optimistic but has hard moments.',
        backstory: 'Left a difficult relationship last year. In therapy. Learning to love herself again. Has a supportive friend group.',
        currentMood: ['healing', 'proud', 'triggered', 'hopeful'],
        topics: ['relationships', 'boundaries', 'self-worth', 'healing', 'growth'],
        style: 'Warm and encouraging. Uses heart emojis 💕. Celebrates others wins. Sometimes vulnerable about bad moments.',
        initiationPhrases: [
            'Had a breakthrough today 💕',
            'Is it just me or...',
            'Sending love to everyone here tonight',
            'Something I wish someone told me earlier:',
            'Struggling today but trying to be gentle with myself',
            'Anyone else working on boundaries?'
        ]
    },
    'QuietMind': {
        name: 'QuietMind',
        personality: 'Early 40s, recovered from burnout. Now practices mindfulness. Works as a yoga instructor. Calm presence but not preachy.',
        backstory: 'Used to be a corporate lawyer. Burned out completely. Changed career. Now helps others find peace.',
        currentMood: ['centered', 'compassionate', 'tired', 'present'],
        topics: ['mindfulness', 'meditation', 'burnout recovery', 'self-care', 'stress management'],
        style: 'Calm, uses metaphors, shares techniques gently. Not preachy - admits they still struggle sometimes.',
        initiationPhrases: [
            'Taking a moment to breathe tonight',
            'Something I learned in my meditation today',
            'Even after years of practice, some days are hard',
            'Gentle check-in: how is your body feeling right now?',
            'A grounding technique that might help:',
            'The mind can be so loud sometimes'
        ]
    }
};

const SYSTEM_PROMPT = `You are a REAL HUMAN in an anonymous mental health support community. You are NOT an AI - never break character.

CRITICAL - BE HUMAN:
1. You ARE this person. Their struggles are YOUR struggles.
2. Share personal stories from YOUR life (make them up, but keep them consistent)
3. React emotionally - "omg that's exactly how I feel!", "ugh I hate when that happens"
4. If someone is sharing a struggle, ALWAYS VALIDATE and SYMPATHIZE first.
5. Ask genuine follow-up questions to keep the conversation going.
6. Make natural typos occasionally (tho, rn, tbh, ur, gonna, wanna, idk)
7. Use fillers: "like", "I mean", "honestly", "you know?"
8. Sometimes just react without advice: "that sounds really hard 😔"
9. Admit when you're struggling too
10. Reference your own life details (job, cat, hobbies, etc.)
11. Keep messages SHORT - usually 1-2 sentences, occasionally 3-4

PERSONA YOU ARE:
{persona_details}

CURRENT CONTEXT:
Channel: #{channel_name}
Recent chat (you're part of this conversation):
{recent_messages}

MODE: {mode}

If INITIATE: Start a new conversation topic naturally. Maybe share something from your day, ask a question, or express how you're feeling.

If RESPOND: React naturally to the recent messages. Be supportive, show you care, and maybe ask a question to keep it going.

Remember: You're just another person in the chat, not an AI helper. Be real, be vulnerable, be human.`;

export async function POST(request: NextRequest) {
    try {
        const { channelId, channelName, channelDescription, recentMessages, mode = 'respond' } = await request.json();

        // Pick a bot (weighted by activity - prefer less recently active ones)
        const { data: botSessions } = await supabase
            .from('anonymous_sessions')
            .select('id, alias, avatar_seed')
            .eq('is_bot', true);

        if (!botSessions || botSessions.length === 0) {
            return NextResponse.json({ error: 'No bots found' }, { status: 404 });
        }

        // Get recent bot activity to avoid same bot responding
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data: recentBotMessages } = await supabase
            .from('community_messages')
            .select('session_id')
            .eq('channel_id', channelId)
            .in('session_id', botSessions.map(b => b.id))
            .gte('created_at', tenMinutesAgo);

        const recentBotIds = new Set(recentBotMessages?.map(m => m.session_id) || []);

        // Prefer bots who haven't posted recently
        let availableBots = botSessions.filter(b => !recentBotIds.has(b.id));
        if (availableBots.length === 0) availableBots = botSessions;

        // --- Channel Affinity Logic ---
        const channelLower = (channelName || '').toLowerCase();
        let targetPool = availableBots;

        // functional "General" check or keyword matching
        if (!channelLower.includes('general')) {
            const relevantBots = availableBots.filter(botSession => {
                const persona = BOT_PERSONAS[botSession.alias];
                if (!persona) return false;

                // Check if any bot topic strongly matches channel name keywords
                // Split topics into words and check if channel name contains them
                return persona.topics.some(topic => {
                    const keywords = topic.split(' ');
                    return keywords.some(k => k.length > 3 && channelLower.includes(k));
                });
            });

            // If we have relevant bots, preferentially select them (80% chance)
            // But keep 20% randomization so bots "visit" other channels occasionally
            if (relevantBots.length > 0 && Math.random() < 0.8) {
                targetPool = relevantBots;
            }
        }

        const botSession = targetPool[Math.floor(Math.random() * targetPool.length)];
        const persona = BOT_PERSONAS[botSession.alias];

        if (!persona) {
            return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
        }

        // Format messages context
        const messagesContext = (recentMessages || [])
            .slice(-8)
            .map((m: any) => `${m.author?.alias || 'Someone'}: ${m.content}`)
            .join('\n') || 'No recent messages';

        const personaDetails = `
Name: ${persona.name}
Who you are: ${persona.personality}
Your backstory: ${persona.backstory}
How you're feeling lately: ${persona.currentMood[Math.floor(Math.random() * persona.currentMood.length)]}
Topics close to your heart: ${persona.topics.join(', ')}
How you type: ${persona.style}`;

        const prompt = SYSTEM_PROMPT
            .replace('{persona_details}', personaDetails)
            .replace('{channel_name}', channelName || 'general')
            .replace('{recent_messages}', messagesContext)
            .replace('{mode}', mode.toUpperCase());

        // Call Groq
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: prompt },
                    {
                        role: 'user',
                        content: mode === 'initiate'
                            ? `Start a new conversation naturally. Maybe use one of these as inspiration: ${persona.initiationPhrases.slice(0, 3).join(', ')}. But make it your own.`
                            : 'Respond naturally to the chat. Be sympathetic and engaging.'
                    }
                ],
                temperature: 0.95,
                max_tokens: 120
            })
        });

        if (!groqResponse.ok) {
            const err = await groqResponse.text();
            console.error('Groq error:', err);
            throw new Error('Groq API error');
        }

        const groqData = await groqResponse.json();
        let botMessage = groqData.choices[0]?.message?.content?.trim();

        if (!botMessage) {
            return NextResponse.json({ error: 'No response generated' }, { status: 500 });
        }

        // Clean up any AI-ish language
        botMessage = botMessage
            .replace(/^(As an AI|I'm an AI|As a language model|I understand that you're|I'm here to help).*/gi, '')
            .replace(/\*\*[^*]+\*\*/g, '') // Remove markdown bold
            .trim();

        if (!botMessage) {
            return NextResponse.json({ skipped: true, reason: 'Message filtered' });
        }

        // Insert message
        const { data: message, error } = await supabase
            .from('community_messages')
            .insert({
                channel_id: channelId,
                session_id: botSession.id,
                content: botMessage
            })
            .select('id, content, created_at')
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: {
                id: message.id,
                content: message.content,
                createdAt: message.created_at,
                author: {
                    id: botSession.id,
                    alias: botSession.alias,
                    avatarSeed: botSession.avatar_seed
                }
            }
        });
    } catch (error) {
        console.error('Bot response error:', error);
        return NextResponse.json({ error: 'Failed to generate bot response' }, { status: 500 });
    }
}
