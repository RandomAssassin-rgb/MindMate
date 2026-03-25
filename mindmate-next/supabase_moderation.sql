-- ============================================================
-- Task 6.1: Community Moderation
-- ============================================================

-- Add visibility control to existing posts
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Create reports table
CREATE TABLE IF NOT EXISTS forum_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('Inappropriate', 'Harassment', 'Misinformation', 'Self-Harm', 'Other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;

-- 1. Anyone authenticated can submit a report
CREATE POLICY "Users can insert reports" ON forum_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Only admins can read/update reports
-- (Simplification: We'll check for admin role in the application layer or use a hardcoded admin UID/Email)
CREATE POLICY "Admins can manage reports" ON forum_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email LIKE '%admin%') -- Basic rule for this demo
    )
  );

-- Update forum_posts RLS to exclude hidden posts for non-admins
DROP POLICY IF EXISTS "Authenticated users can read posts" ON forum_posts;

CREATE POLICY "Users can read non-hidden posts" ON forum_posts
  FOR SELECT USING (
    (is_hidden = FALSE) OR 
    (auth.uid() = user_id) OR
    (EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email LIKE '%admin%'))
  );
