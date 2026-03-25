-- ============================================================
-- Task 5.3: User Memory (AI Personalization)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, key)
);

ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memory" ON user_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memory" ON user_memory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memory" ON user_memory
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own memory" ON user_memory
  FOR DELETE USING (auth.uid() = user_id);
