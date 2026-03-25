-- ============================================================
-- Task 5.4: Community Forum Posts
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Anxiety & Stress', 'Depression Support', 'Student Life', 'Daily Wins', 'Recovery')),
  body TEXT NOT NULL CHECK (char_length(body) >= 10 AND char_length(body) <= 2000),
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read posts
CREATE POLICY "Authenticated users can read posts" ON forum_posts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can insert their own posts
CREATE POLICY "Users can insert own posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts only
CREATE POLICY "Users can delete own posts" ON forum_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast category + date queries
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent ON forum_posts(parent_id);
