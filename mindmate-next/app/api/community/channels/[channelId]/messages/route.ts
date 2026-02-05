import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Get messages for a channel
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const { channelId } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const before = searchParams.get('before'); // For pagination

        let query = supabase
            .from('community_messages')
            .select(`
        id,
        content,
        created_at,
        session:anonymous_sessions!inner(id, alias, avatar_seed)
      `)
            .eq('channel_id', channelId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (before) {
            query = query.lt('created_at', before);
        }

        const { data: messages, error } = await query;

        if (error) throw error;

        // Reverse to show oldest first
        const formattedMessages = (messages || []).reverse().map(msg => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.created_at,
            author: {
                id: (msg.session as any).id,
                alias: (msg.session as any).alias,
                avatarSeed: (msg.session as any).avatar_seed
            }
        }));

        return NextResponse.json({ messages: formattedMessages });
    } catch (error) {
        console.error('Messages GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST: Send a message
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const { channelId } = await params;
        const { sessionId, content } = await request.json();

        if (!sessionId || !content?.trim()) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (content.length > 1000) {
            return NextResponse.json({ error: 'Message too long' }, { status: 400 });
        }

        // Verify session
        const { data: session, error: sessionError } = await supabase
            .from('anonymous_sessions')
            .select('id, alias, avatar_seed, is_banned')
            .eq('id', sessionId)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        if (session.is_banned) {
            return NextResponse.json({ error: 'You are banned' }, { status: 403 });
        }

        // Insert message
        const { data: message, error } = await supabase
            .from('community_messages')
            .insert({
                channel_id: channelId,
                session_id: sessionId,
                content: content.trim()
            })
            .select('id, content, created_at')
            .single();

        if (error) throw error;

        // Update presence
        await supabase
            .from('community_presence')
            .upsert({
                session_id: sessionId,
                channel_id: channelId,
                last_seen: new Date().toISOString()
            });

        return NextResponse.json({
            success: true,
            message: {
                id: message.id,
                content: message.content,
                createdAt: message.created_at,
                author: {
                    id: session.id,
                    alias: session.alias,
                    avatarSeed: session.avatar_seed
                }
            }
        });
    } catch (error) {
        console.error('Messages POST error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

// Trigger bot response (called from frontend with delay)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const { channelId } = await params;
        const { recentMessages } = await request.json();

        // Get channel info
        const { data: channel } = await supabase
            .from('community_channels')
            .select('name, description')
            .eq('id', channelId)
            .single();

        // Call bot response API internally
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost')
            ? 'http://localhost:3000'
            : process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/community/bot-response`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                channelId,
                channelName: channel?.name,
                channelDescription: channel?.description,
                recentMessages
            })
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Bot trigger error:', error);
        return NextResponse.json({ error: 'Failed to trigger bot' }, { status: 500 });
    }
}
