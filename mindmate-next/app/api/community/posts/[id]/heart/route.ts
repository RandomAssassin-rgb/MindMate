import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST: Toggle heart on a post
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session required' }, { status: 401 });
        }

        // Check if already hearted
        const { data: existing } = await supabase
            .from('community_hearts')
            .select('session_id')
            .eq('session_id', sessionId)
            .eq('post_id', postId)
            .single();

        if (existing) {
            // Remove heart
            const { error } = await supabase
                .from('community_hearts')
                .delete()
                .eq('session_id', sessionId)
                .eq('post_id', postId);

            if (error) throw error;

            return NextResponse.json({ hearted: false });
        } else {
            // Add heart
            const { error } = await supabase
                .from('community_hearts')
                .insert({
                    session_id: sessionId,
                    post_id: postId
                });

            if (error) throw error;

            return NextResponse.json({ hearted: true });
        }

    } catch (error) {
        console.error('Heart error:', error);
        return NextResponse.json({ error: 'Failed to update heart' }, { status: 500 });
    }
}

// GET: Check if session has hearted a post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;
        const sessionId = request.nextUrl.searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ hearted: false });
        }

        const { data: existing } = await supabase
            .from('community_hearts')
            .select('session_id')
            .eq('session_id', sessionId)
            .eq('post_id', postId)
            .single();

        return NextResponse.json({ hearted: !!existing });

    } catch (error) {
        return NextResponse.json({ hearted: false });
    }
}
