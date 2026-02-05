import { createBrowserClient } from '@supabase/ssr';

// Supabase configuration - using environment variables in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client for client-side usage
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Database types (can be auto-generated with Supabase CLI)
export type Database = {
    public: {
        Tables: {
            mood_entries: {
                Row: {
                    id: string;
                    user_id: string;
                    mood: number;
                    note: string | null;
                    activities: string[] | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['mood_entries']['Row'], 'id' | 'created_at'>;
            };
            journal_entries: {
                Row: {
                    id: string;
                    user_id: string;
                    situation: string;
                    automatic_thought: string;
                    emotions: string;
                    cognitive_distortions: string[] | null;
                    balanced_thought: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['journal_entries']['Row'], 'id' | 'created_at'>;
            };
            meditations: {
                Row: {
                    id: string;
                    title: string;
                    category: string;
                    audio_url: string;
                    duration_sec: number;
                    description: string | null;
                    image_url: string | null;
                };
            };
            safety_plans: {
                Row: {
                    id: string;
                    user_id: string;
                    data: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['safety_plans']['Row'], 'id' | 'created_at' | 'updated_at'>;
            };
        };
    };
};
