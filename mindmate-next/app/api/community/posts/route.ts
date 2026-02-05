import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: List posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const topicId = searchParams.get('topicId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('community_posts')
            .select(`
        id,
        content,
        hearts_count,
        comments_count,
        created_at,
        session:anonymous_sessions!inner(alias, avatar_seed),
        topic:community_topics!inner(id, title, icon, color)
      `)
            .eq('is_hidden', false)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (topicId) {
            query = query.eq('topic_id', topicId);
        }

        const { data: posts, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            posts: posts?.map(post => ({
                id: post.id,
                content: post.content,
                heartsCount: post.hearts_count,
                commentsCount: post.comments_count,
                createdAt: post.created_at,
                author: {
                    alias: (post.session as any).alias,
                    avatarSeed: (post.session as any).avatar_seed
                },
                topic: post.topic
            })) || [],
            page,
            limit
        });

    } catch (error) {
        console.error('Posts GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST: Create new post
export async function POST(request: NextRequest) {
    try {
        const { sessionId, topicId, content } = await request.json();

        if (!sessionId || !topicId || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (content.length < 10) {
            return NextResponse.json(
                { error: 'Post must be at least 10 characters' },
                { status: 400 }
            );
        }

        if (content.length > 2000) {
            return NextResponse.json(
                { error: 'Post cannot exceed 2000 characters' },
                { status: 400 }
            );
        }

        // Verify session exists and not banned
        const { data: session, error: sessionError } = await supabase
            .from('anonymous_sessions')
            .select('id, is_banned')
            .eq('id', sessionId)
            .single();

        if (sessionError || !session) {
            return NextResponse.json(
                { error: 'Invalid session' },
                { status: 401 }
            );
        }

        if (session.is_banned) {
            return NextResponse.json(
                { error: 'Your alias has been suspended' },
                { status: 403 }
            );
        }

        // Create post
        const { data: post, error } = await supabase
            .from('community_posts')
            .insert({
                session_id: sessionId,
                topic_id: topicId,
                content: content.trim()
            })
            .select('id, content, created_at')
            .single();

        if (error) throw error;

        // Update last active
        await supabase
            .from('anonymous_sessions')
            .update({ last_active: new Date().toISOString() })
            .eq('id', sessionId);

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                content: post.content,
                createdAt: post.created_at
            }
        });

    } catch (error) {
        console.error('Posts POST error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
