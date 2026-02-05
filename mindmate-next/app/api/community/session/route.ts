import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Word list for recovery codes
const RECOVERY_WORDS = [
    'HOPE', 'STAR', 'CALM', 'WAVE', 'RISE', 'HEAL', 'GROW', 'FLOW',
    'GLOW', 'WISH', 'LOVE', 'CARE', 'SAFE', 'WARM', 'SOFT', 'KIND',
    'FREE', 'BOLD', 'TRUE', 'WISE', 'PURE', 'GOOD', 'LIFE', 'SOUL'
];

function generateRecoveryCode(): string {
    const words: string[] = [];
    for (let i = 0; i < 6; i++) {
        words.push(RECOVERY_WORDS[Math.floor(Math.random() * RECOVERY_WORDS.length)]);
    }
    return words.join('-');
}

function generateRandomAlias(): string {
    const adjectives = ['Hopeful', 'Calm', 'Brave', 'Gentle', 'Kind', 'Peaceful', 'Strong', 'Wise'];
    const nouns = ['Star', 'Wave', 'Light', 'Heart', 'Soul', 'Spirit', 'Mind', 'Dream'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
}

// POST: Create new session
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, alias, pin, recoveryCode } = body;

        if (action === 'create') {
            // Create new anonymous session
            const finalAlias = alias || generateRandomAlias();

            // Check if alias exists
            const { data: existing } = await supabase
                .from('anonymous_sessions')
                .select('id')
                .ilike('alias', finalAlias)
                .single();

            if (existing) {
                return NextResponse.json(
                    { error: 'This alias is already taken. Please try another.' },
                    { status: 400 }
                );
            }

            // Hash PIN and recovery code
            const pinHash = await bcrypt.hash(pin, 10);
            const newRecoveryCode = generateRecoveryCode();
            const recoveryHash = await bcrypt.hash(newRecoveryCode, 10);

            // Create session
            const { data: session, error } = await supabase
                .from('anonymous_sessions')
                .insert({
                    alias: finalAlias,
                    pin_hash: pinHash,
                    recovery_code_hash: recoveryHash
                })
                .select('id, alias, avatar_seed')
                .single();

            if (error) throw error;

            return NextResponse.json({
                success: true,
                session: {
                    id: session.id,
                    alias: session.alias,
                    avatarSeed: session.avatar_seed
                },
                recoveryCode: newRecoveryCode, // Only returned once at creation!
                message: 'Save your recovery code! You will need it if you forget your PIN.'
            });

        } else if (action === 'verify') {
            // Verify existing session with PIN
            const { data: session, error } = await supabase
                .from('anonymous_sessions')
                .select('id, alias, avatar_seed, pin_hash, is_banned')
                .ilike('alias', alias)
                .single();

            if (error || !session) {
                return NextResponse.json(
                    { error: 'Alias not found. Please check your spelling.' },
                    { status: 404 }
                );
            }

            if (session.is_banned) {
                return NextResponse.json(
                    { error: 'This alias has been suspended for violating community guidelines.' },
                    { status: 403 }
                );
            }

            const pinValid = await bcrypt.compare(pin, session.pin_hash);
            if (!pinValid) {
                return NextResponse.json(
                    { error: 'Incorrect PIN. Please try again.' },
                    { status: 401 }
                );
            }

            // Update last active
            await supabase
                .from('anonymous_sessions')
                .update({ last_active: new Date().toISOString() })
                .eq('id', session.id);

            return NextResponse.json({
                success: true,
                session: {
                    id: session.id,
                    alias: session.alias,
                    avatarSeed: session.avatar_seed
                }
            });

        } else if (action === 'recover') {
            // Recover session with recovery code
            const { data: session, error } = await supabase
                .from('anonymous_sessions')
                .select('id, alias, avatar_seed, recovery_code_hash, is_banned')
                .ilike('alias', alias)
                .single();

            if (error || !session) {
                return NextResponse.json(
                    { error: 'Alias not found.' },
                    { status: 404 }
                );
            }

            if (session.is_banned) {
                return NextResponse.json(
                    { error: 'This alias has been suspended.' },
                    { status: 403 }
                );
            }

            const codeValid = await bcrypt.compare(recoveryCode, session.recovery_code_hash);
            if (!codeValid) {
                return NextResponse.json(
                    { error: 'Invalid recovery code.' },
                    { status: 401 }
                );
            }

            // Update PIN with new one
            const newPinHash = await bcrypt.hash(pin, 10);
            await supabase
                .from('anonymous_sessions')
                .update({ pin_hash: newPinHash, last_active: new Date().toISOString() })
                .eq('id', session.id);

            return NextResponse.json({
                success: true,
                session: {
                    id: session.id,
                    alias: session.alias,
                    avatarSeed: session.avatar_seed
                },
                message: 'PIN reset successfully!'
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Session API error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
