-- MindMate Database Migrations
-- Run these in your Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- ============================================================
-- Task 2.5: Crisis Events Table (logs crisis detections, no content stored)
-- ============================================================
CREATE TABLE IF NOT EXISTS crisis_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/read crisis events
CREATE POLICY "Service role only" ON crisis_events
  USING (false);

-- ============================================================
-- Task 1.1: Community Waitlist
-- ============================================================
CREATE TABLE IF NOT EXISTS community_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can add themselves to the waitlist
CREATE POLICY "Anyone can join waitlist" ON community_waitlist
  FOR INSERT WITH CHECK (true);

-- Only the owner can read their own entry
CREATE POLICY "Users see own waitlist entry" ON community_waitlist
  FOR SELECT USING (true);

-- ============================================================
-- Task 2.4: Video Waitlist
-- ============================================================
CREATE TABLE IF NOT EXISTS video_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE video_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join video waitlist" ON video_waitlist
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Task 1.4: Mood Logs Table (with RLS)
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5) NOT NULL,
  activities TEXT[] DEFAULT '{}',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own mood logs" ON mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own mood logs" ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs" ON mood_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- Task 2.1: Conversations & Messages Tables
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations" ON conversations
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can access messages in their own conversations
CREATE POLICY "Users can manage own messages" ON messages
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
