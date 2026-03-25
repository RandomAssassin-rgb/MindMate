'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, MessageCircle, Trash2, EyeOff, Send, Users, Loader2, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['Anxiety & Stress', 'Depression Support', 'Student Life', 'Daily Wins', 'Recovery'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_META: Record<Category, { emoji: string; color: string }> = {
  'Anxiety & Stress': { emoji: '😤', color: '#8B5CF6' },
  'Depression Support': { emoji: '💙', color: '#3B82F6' },
  'Student Life': { emoji: '📚', color: '#F59E0B' },
  'Daily Wins': { emoji: '🏆', color: '#22C55E' },
  'Recovery': { emoji: '🌱', color: '#06B6D4' },
};

type Post = {
  id: string;
  user_id: string;
  parent_id: string | null;
  category: Category;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  replies?: Post[];
  author_email?: string;
};

// ── Styled Components ──────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
`;

const Hero = styled.div`
  background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%);
  padding: 64px 24px 48px;
  text-align: center;
  color: white;
`;

const HeroIcon = styled.div`
  width: 72px; height: 72px;
  background: rgba(139,92,246,0.2);
  border: 2px solid rgba(139,92,246,0.4);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(26px, 5vw, 36px);
  font-weight: 800;
  margin-bottom: 12px;
  span { color: #A78BFA; }
`;

const HeroSubtitle = styled.p`
  color: rgba(255,255,255,0.65);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 15px;
`;

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryBtn = styled.button<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid ${p => p.active ? p.color : 'transparent'};
  background: ${p => p.active ? `${p.color}18` : 'white'};
  color: ${p => p.active ? p.color : '#475569'};
  font-weight: ${p => p.active ? 700 : 500};
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  &:hover { border-color: ${p => p.color}; }
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NewPostBox = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  color: #0F172A;
  outline: none;
  &:focus { border-color: #8B5CF6; box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const AnonToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748B;
  cursor: pointer;
  input { accent-color: #8B5CF6; }
`;

const PostCard = styled(motion.div)`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 20px;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const AuthorChip = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
`;

const DateLabel = styled.div`
  font-size: 12px;
  color: #94A3B8;
`;

const PostBody = styled.p`
  color: #0F172A;
  line-height: 1.65;
  font-size: 15px;
  margin: 0 0 16px;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SubtleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 13px;
  color: #64748B;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.15s;
  &:hover { background: #F1F5F9; color: #0F172A; }
`;

const RepliesSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReplyCard = styled.div`
  background: #F8FAFC;
  border-radius: 10px;
  padding: 12px 16px;
  border-left: 3px solid #E2E8F0;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94A3B8;
  padding: 64px 24px;
  background: white;
  border-radius: 16px;
  border: 1px dashed #E2E8F0;
`;

// ── Main Component ─────────────────────────────────────────────
export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('Anxiety & Stress');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [newBody, setNewBody] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [replyBody, setReplyBody] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  async function fetchPosts() {
    setLoading(true);
    setTableMissing(false);
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('category', activeCategory)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('not found')) {
        setTableMissing(true);
      }
      setLoading(false);
      return;
    }

    if (data) {
      // Attach replies
      const withReplies = await Promise.all(data.map(async (p) => {
        const { data: replies } = await supabase
          .from('forum_posts')
          .select('*')
          .eq('parent_id', p.id)
          .order('created_at', { ascending: true });
        return { ...p, replies: replies || [] };
      }));
      setPosts(withReplies as Post[]);
    }
    setLoading(false);
  }

  async function submitPost() {
    if (!newBody.trim() || !userId) return;
    setSubmitting(true);
    await supabase.from('forum_posts').insert({
      user_id: userId, category: activeCategory,
      body: newBody.trim(), is_anonymous: isAnon, parent_id: null,
    });
    setNewBody('');
    await fetchPosts();
    setSubmitting(false);
  }

  async function submitReply(parentId: string) {
    const body = replyBody[parentId];
    if (!body?.trim() || !userId) return;
    await supabase.from('forum_posts').insert({
      user_id: userId, category: activeCategory,
      body: body.trim(), is_anonymous: isAnon, parent_id: parentId,
    });
    setReplyBody(prev => ({ ...prev, [parentId]: '' }));
    setReplyingTo(null);
    await fetchPosts();
  }

  async function deletePost(id: string) {
    await supabase.from('forum_posts').delete().eq('id', id);
    await fetchPosts();
  }

  const [reportingTask, setReportingTask] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate');

  async function submitReport(postId: string) {
    if (!userId) return;
    await supabase.from('forum_reports').insert({
      reporter_id: userId,
      post_id: postId,
      reason: reportReason,
    });
    setReportingTask(null);
    alert('Thank you. This post has been reported for review.');
  }

  function toggleExpand(id: string) {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function formatAuthor(post: Post) {
    if (post.is_anonymous) return '🔒 Anonymous';
    if (post.user_id === userId) return '✨ You';
    return `Member #${post.user_id.slice(0, 6)}`;
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString();
  }

  const meta = CATEGORY_META[activeCategory];

  return (
    <PageWrapper>
      <Hero>
        <HeroIcon><Users size={32} color="#A78BFA" /></HeroIcon>
        <HeroTitle>MindMate <span>Community</span></HeroTitle>
        <HeroSubtitle>
          A safe, anonymous space to share experiences, find support, and celebrate daily wins with others on the same journey.
        </HeroSubtitle>
      </Hero>

      <Container>
        <Layout>
          {/* Sidebar */}
          <Sidebar>
            {CATEGORIES.map(cat => (
              <CategoryBtn
                key={cat}
                active={activeCategory === cat}
                color={CATEGORY_META[cat].color}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_META[cat].emoji} {cat}
              </CategoryBtn>
            ))}
          </Sidebar>

          {/* Main feed */}
          <Feed>
            {/* New post box */}
            {userId ? (
              <NewPostBox>
                <TextArea
                  placeholder={`Share something in ${activeCategory}…`}
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  maxLength={2000}
                  aria-label="New post text"
                />
                <PostActions>
                  <AnonToggle>
                    <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} />
                    <EyeOff size={14} /> Post anonymously
                  </AnonToggle>
                  <Button
                    size="sm"
                    onClick={submitPost}
                    disabled={submitting || newBody.trim().length < 10}
                  >
                    {submitting ? <Loader2 size={14} /> : <Send size={14} />}
                    {submitting ? 'Posting…' : 'Post'}
                  </Button>
                </PostActions>
              </NewPostBox>
            ) : (
              <NewPostBox style={{ textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
                <a href="/login" style={{ color: '#8B5CF6', fontWeight: 600 }}>Sign in</a> to post and reply.
              </NewPostBox>
            )}

            {/* Posts */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#8B5CF6' }} />
              </div>
            ) : tableMissing ? (
              <EmptyState style={{ borderColor: '#F87171', background: '#FEF2F2' }}>
                <Shield size={48} style={{ color: '#EF4444', marginBottom: '16px', margin: '0 auto' }} />
                <h3 style={{ color: '#991B1B', marginBottom: '8px' }}>Database Sync Required</h3>
                <p style={{ color: '#B91C1C', fontSize: '14px', marginBottom: '20px' }}>
                  The forum tables were not found in your Supabase project. 
                  Please run the SQL migration scripts to enable this feature.
                </p>
                <Button 
                  onClick={() => window.open('/FIX_AUTH.md', '_blank')}
                  style={{ background: '#EF4444', color: 'white' }}
                >
                  View Fix Guide
                </Button>
              </EmptyState>
            ) : posts.length === 0 ? (
              <EmptyState>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{meta.emoji}</div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>No posts yet in {activeCategory}</div>
                <div style={{ fontSize: '14px' }}>Be the first to share something here.</div>
              </EmptyState>
            ) : (
              <AnimatePresence mode="popLayout">
                {posts.map(post => {
                  const expanded = expandedPosts.has(post.id);
                  const repliesCount = post.replies?.length || 0;
                  return (
                    <PostCard
                      key={post.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                    >
                      <PostHeader>
                        <AuthorChip>{formatAuthor(post)}</AuthorChip>
                        <DateLabel>{formatDate(post.created_at)}</DateLabel>
                      </PostHeader>
                      <PostBody>{post.body}</PostBody>
                      <PostFooter>
                        {userId && (
                          <>
                            <SubtleBtn onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}>
                              <MessageCircle size={14} /> Reply
                            </SubtleBtn>
                            <SubtleBtn onClick={() => setReportingTask(reportingTask === post.id ? null : post.id)}>
                              <Shield size={14} /> Report
                            </SubtleBtn>
                          </>
                        )}
                        {repliesCount > 0 && (
                          <SubtleBtn onClick={() => toggleExpand(post.id)}>
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                          </SubtleBtn>
                        )}
                        {post.user_id === userId && (
                          <SubtleBtn onClick={() => deletePost(post.id)} style={{ marginLeft: 'auto', color: '#EF4444' }}>
                            <Trash2 size={14} /> Delete
                          </SubtleBtn>
                        )}
                      </PostFooter>

                      {/* Reporting Form */}
                      {reportingTask === post.id && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#FEF2F2', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select 
                            value={reportReason} 
                            onChange={e => setReportReason(e.target.value)}
                            style={{ fontSize: '13px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #FECACA' }}
                          >
                            {['Inappropriate', 'Harassment', 'Misinformation', 'Self-Harm', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <Button size="sm" onClick={() => submitReport(post.id)} style={{ padding: '4px 12px', fontSize: '12px' }}>
                            Submit Report
                          </Button>
                        </div>
                      )}

                      {/* Reply input */}
                      {replyingTo === post.id && (
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                          <TextArea
                            style={{ minHeight: '56px', fontSize: '14px' }}
                            placeholder="Write a reply…"
                            value={replyBody[post.id] || ''}
                            onChange={e => setReplyBody(prev => ({ ...prev, [post.id]: e.target.value }))}
                            maxLength={2000}
                            aria-label="Reply text"
                          />
                          <Button size="sm" onClick={() => submitReply(post.id)}>
                            <Send size={14} />
                          </Button>
                        </div>
                      )}

                      {/* Replies */}
                      {expanded && post.replies && post.replies.length > 0 && (
                        <RepliesSection>
                          {post.replies.map(reply => (
                            <ReplyCard key={reply.id}>
                              <PostHeader>
                                <AuthorChip>{formatAuthor(reply)}</AuthorChip>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <DateLabel>{formatDate(reply.created_at)}</DateLabel>
                                  {reply.user_id === userId && (
                                    <SubtleBtn onClick={() => deletePost(reply.id)} style={{ color: '#EF4444', padding: '2px 6px' }}>
                                      <Trash2 size={12} />
                                    </SubtleBtn>
                                  )}
                                </div>
                              </PostHeader>
                              <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{reply.body}</p>
                            </ReplyCard>
                          ))}
                        </RepliesSection>
                      )}
                    </PostCard>
                  );
                })}
              </AnimatePresence>
            )}
          </Feed>
        </Layout>
      </Container>
    </PageWrapper>
  );
}
