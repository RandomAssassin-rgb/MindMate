import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: List comments for a post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;

        const { data: comments, error } = await supabase
            .from('community_comments')
            .select(`
        id,
        content,
        created_at,
        session:anonymous_sessions!inner(alias, avatar_seed)
      `)
            .eq('post_id', postId)
            .eq('is_hidden', false)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({
            comments: comments?.map(comment => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at,
                author: {
                    alias: (comment.session as any).alias,
                    avatarSeed: (comment.session as any).avatar_seed
                }
            })) || []
        });

    } catch (error) {
        console.error('Comments GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST: Add comment to post
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;
        const { sessionId, content } = await request.json();

        if (!sessionId || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (content.length < 2) {
            return NextResponse.json(
                { error: 'Comment must be at least 2 characters' },
                { status: 400 }
            );
        }

        if (content.length > 1000) {
            return NextResponse.json(
                { error: 'Comment cannot exceed 1000 characters' },
                { status: 400 }
            );
        }

        // Verify session
        const { data: session, error: sessionError } = await supabase
            .from('anonymous_sessions')
            .select('id, is_banned')
            .eq('id', sessionId)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        if (session.is_banned) {
            return NextResponse.json({ error: 'Your alias has been suspended' }, { status: 403 });
        }

        // Create comment
        const { data: comment, error } = await supabase
            .from('community_comments')
            .insert({
                post_id: postId,
                session_id: sessionId,
                content: content.trim()
            })
            .select('id, content, created_at')
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            comment: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.created_at
            }
        });

    } catch (error) {
        console.error('Comments POST error:', error);
        return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
}
