-- Security Fixes for MindMate

-- Fix for community_waitlist
-- The previous policy 'Users see own waitlist entry' incorrectly used 'USING (true)', 
-- which allowed any public user to read the entire list of waitlist emails.
-- We do not need a SELECT policy at all because by default, RLS blocks all reads
-- unless explicitly granted. We only want to allow INSERTS.

DROP POLICY IF EXISTS "Users see own waitlist entry" ON community_waitlist;
