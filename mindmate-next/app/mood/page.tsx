'use client';

import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Plus, TrendingUp, Calendar, Smile, Heart, Zap, Moon, Coffee, Users, Book, Dumbbell, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, BarChart, Bar } from 'recharts';
import { useRouter } from 'next/navigation';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #FEF3E8 0%, #FFFBF7 50%, #F0F9FF 100%);
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 60px ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;
`;

const PageIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6A00, #FF8C00);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 12px 40px rgba(255, 106, 0, 0.3);
`;

const PageTitle = styled.h1`
  font-size: 42px;
  margin-bottom: 12px;
  
  span {
    background: linear-gradient(135deg, #FF6A00, #FF8C00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 18px;
  max-width: 500px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 400px 1fr;
  }
`;

const QuickLogCard = styled(Card)`
  background: white;
  border: none;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  overflow: hidden;
`;

const LogHeader = styled.div`
  background: linear-gradient(135deg, #FF6A0010, #FFD16610);
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogContent = styled.div`
  padding: 24px;
`;

const MoodSelector = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
`;

const MoodButton = styled(motion.button) <{ selected: boolean; moodColor: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid ${({ selected, moodColor }) => selected ? moodColor : '#E5E7EB'};
  background: ${({ selected, moodColor }) => selected ? `${moodColor}15` : 'white'};
  cursor: pointer;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: ${({ selected, moodColor }) => selected ? `0 8px 20px ${moodColor}30` : '0 2px 8px rgba(0,0,0,0.05)'};
`;

const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;
`;

const ActivityChip = styled(motion.button) <{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 16px;
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  background: ${({ selected, theme }) => selected ? `${theme.colors.primary}10` : 'white'};
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.textSecondary};
  transition: all 0.2s;
  
  svg {
    width: 22px;
    height: 22px;
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  font-family: inherit;
  font-size: 15px;
  resize: none;
  min-height: 100px;
  margin-bottom: 20px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}15;
  }
`;

const ChartCard = styled(Card)`
  background: white;
  border: none;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  min-height: 400px;
  overflow: hidden;
`;

const ChartHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChartContent = styled.div`
  padding: 24px;
`;

const ChartContainer = styled.div`
  height: 250px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
`;

const StatBox = styled(motion.div)`
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #FF6A0008, #FFD16608);
  border-radius: 16px;
  border: 1px solid #E5E7EB;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6A00, #FF8C00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 4px;
`;

const EntriesList = styled.div`
  margin-top: 60px;
`;

const EntriesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const EntriesTitle = styled.h2`
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EntryCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #E5E7EB;
`;

const EntryMood = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const EntryContent = styled.div`
  flex: 1;
`;

const EntryDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 4px;
`;

const EntryNote = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

const EntryActivities = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActivityTag = styled.span`
  padding: 4px 10px;
  background: #F3F4F6;
  border-radius: 100px;
  font-size: 12px;
  color: #4B5563;
`;

const InsightBox = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
const moodColors = ['#EF4444', '#F59E0B', '#6B7280', '#22C55E', '#3B82F6'];
const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

const activities = [
  { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'work', label: 'Work', icon: Coffee },
  { id: 'reading', label: 'Reading', icon: Book },
  { id: 'meditation', label: 'Meditate', icon: Heart },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'outdoors', label: 'Outdoors', icon: TrendingUp },
  { id: 'others', label: 'Others', icon: Plus }
];

interface MoodEntry {
  id: string;
  mood_score: number;
  note: string | null;
  activities: string[] | null;
  created_at: string;
}

// Remove hardcoded chartData

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMoodPage = async () => {
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Fetch real entries
        const { data, error } = await supabase
          .from('mood_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setEntries(data);
          
          if (data.length >= 3) {
            setLoadingInsight(true);
            fetch('/api/mood/insight', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ moodLogs: data.slice(0, 14) })
            })
            .then(res => res.json())
            .then(json => setInsight(json.insight))
            .catch(console.error)
            .finally(() => setLoadingInsight(false));
          }
        }
      }
      setFetching(false);

      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, delay: 0.3 }
        );
      }
    };

    initMoodPage();
  }, []);

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId]
    );
  };

  const saveMood = async () => {
    if (!user) {
      router.push('/login?redirect=/mood');
      return;
    }

    if (selectedMood === null) return;

    setLoading(true);
    try {
      // Process activities
      let finalActivities = [...selectedActivities];
      if (finalActivities.includes('others')) {
        finalActivities = finalActivities.filter(a => a !== 'others');
        if (customActivity.trim()) {
          finalActivities.push(customActivity.trim());
        }
      }

      // Save to Supabase
      const { data, error } = await supabase
        .from('mood_logs')
        .insert([{
          user_id: user.id,
          mood_score: selectedMood,
          note: note || null,
          activities: finalActivities.length > 0 ? finalActivities : null,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEntries(prev => [data, ...prev]);
        setSelectedMood(null);
        setSelectedActivities([]);
        setCustomActivity('');
        setNote('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Failed to save mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood_score, 0) / entries.length).toFixed(1)
    : '–';

  // Compute dynamic chart data
  const dynamicChartData = [...entries].slice(0, 7).reverse().map(e => ({
    day: new Date(e.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: e.mood_score
  }));

  const activityCounts: Record<string, number> = {};
  entries.forEach(e => {
    if (e.activities) {
      e.activities.forEach(a => {
        activityCounts[a] = (activityCounts[a] || 0) + 1;
      });
    }
  });
  
  const activityData = Object.entries(activityCounts).map(([name, count]) => ({
    name: activities.find(act => act.id === name)?.label || name,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <PageWrapper>
      <Container>
        <PageHeader
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageIcon>
            <TrendingUp size={36} color="white" />
          </PageIcon>
          <PageTitle>
            Track Your <span>Mood</span>
          </PageTitle>
          <PageSubtitle>
            Log how you're feeling and discover patterns in your emotional well-being
          </PageSubtitle>
        </PageHeader>

        <Grid>
          {/* Quick Log */}
          <QuickLogCard>
            <LogHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <Sparkles size={20} color="#FF6A00" />
                How are you feeling?
              </CardTitle>
            </LogHeader>

            <LogContent>
              <MoodSelector>
                {moodEmojis.map((emoji, index) => (
                  <MoodButton
                    key={index}
                    selected={selectedMood === index + 1}
                    moodColor={moodColors[index]}
                    onClick={() => setSelectedMood(index + 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {emoji}
                  </MoodButton>
                ))}
              </MoodSelector>

              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', marginBottom: '24px' }}
                >
                  <span style={{
                    color: moodColors[selectedMood - 1],
                    fontWeight: 600,
                    fontSize: '15px'
                  }}>
                    {moodLabels[selectedMood - 1]}
                  </span>
                </motion.div>
              )}

              <SectionLabel>What have you been up to?</SectionLabel>
              <ActivitiesGrid>
                {activities.map(activity => (
                  <ActivityChip
                    key={activity.id}
                    selected={selectedActivities.includes(activity.id)}
                    onClick={() => toggleActivity(activity.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <activity.icon />
                    {activity.label}
                  </ActivityChip>
                ))}
              </ActivitiesGrid>

              {selectedActivities.includes('others') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginBottom: 24 }}
                >
                  <SectionLabel>Specify Other Activity</SectionLabel>
                  <NoteInput
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    placeholder="What else did you do?"
                    style={{ minHeight: '60px', borderRadius: '12px' }}
                  />
                </motion.div>
              )}

              <SectionLabel>Add a note (optional)</SectionLabel>
              <NoteInput
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How are you really feeling today?"
              />

              <Button
                fullWidth
                onClick={saveMood}
                disabled={selectedMood === null || loading}
                loading={loading}
                leftIcon={saved ? <Check size={18} /> : (user ? <Plus size={18} /> : null)}
                style={{ borderRadius: '14px', height: '52px' }}
              >
                {!user ? 'Log in to Save Mood' : (saved ? 'Saved!' : 'Log My Mood')}
              </Button>
            </LogContent>
          </QuickLogCard>

          {/* Chart */}
          <ChartCard>
            <ChartHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <Calendar size={20} color="#FF6A00" />
                Your Trends & Insights
              </CardTitle>
            </ChartHeader>

            <ChartContent>
              {entries.length >= 3 ? (
                <>
                  <InsightBox>
                    <div style={{ flexShrink: 0, padding: 8, background: '#EFF6FF', borderRadius: 12 }}>
                      <Sparkles size={24} color="#3B82F6" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>Weekly AI Insight</div>
                      {loadingInsight ? (
                        <div style={{ display: 'flex', gap: '8px', opacity: 0.5, flexWrap: 'wrap' }}>
                          <span style={{ width: '80%', height: '16px', background: '#CBD5E1', borderRadius: '4px', display: 'inline-block' }}></span>
                          <span style={{ width: '60%', height: '16px', background: '#CBD5E1', borderRadius: '4px', display: 'inline-block' }}></span>
                        </div>
                      ) : (
                        <div style={{ color: '#475569', fontSize: 14, lineHeight: 1.5 }}>
                          {insight}
                        </div>
                      )}
                    </div>
                  </InsightBox>
                  
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Mood Last 7 Entries</div>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dynamicChartData}>
                        <defs>
                          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                          dataKey="day"
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={[1, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                    <Tooltip
                      contentStyle={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: any) => [moodEmojis[value - 1] + ' ' + moodLabels[value - 1], 'Mood']}
                    />
                        <Area
                          type="monotone"
                          dataKey="mood"
                          stroke="#FF6A00"
                          strokeWidth={3}
                          fill="url(#moodGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  {activityData.length > 0 && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginTop: 32, marginBottom: 16 }}>Top Activities</div>
                      <ChartContainer style={{ height: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activityData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <Tooltip
                              cursor={{ fill: 'transparent' }}
                              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                  <TrendingUp size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontWeight: 500, color: '#475569', marginBottom: 8 }}>Not enough data yet</div>
                  <p style={{ fontSize: 14, maxWidth: 250, margin: '0 auto' }}>Log your mood for at least 3 days to unlock insights and trends.</p>
                </div>
              )}

              <StatsRow ref={statsRef}>
                <StatBox>
                  <StatValue>{avgMood}</StatValue>
                  <StatLabel>Average Mood</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>{entries.length}</StatValue>
                  <StatLabel>Total Entries</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue>7</StatValue>
                  <StatLabel>Day Streak 🔥</StatLabel>
                </StatBox>
              </StatsRow>
            </ChartContent>
          </ChartCard>
        </Grid>

        {/* Recent Entries */}
        {!user && !fetching && (
          <EntriesList style={{ textAlign: 'center', opacity: 0.7 }}>
            <p>Please log in to view your mood history.</p>
            <Button variant="secondary" onClick={() => router.push('/login?redirect=/mood')} style={{ marginTop: '16px' }}>
              Log In securely
            </Button>
          </EntriesList>
        )}

        {user && entries.length === 0 && !fetching && (
          <EntriesList style={{ textAlign: 'center', opacity: 0.7 }}>
            <p>No mood entries yet. Your history will appear here.</p>
          </EntriesList>
        )}

        {user && entries.length > 0 && (
          <EntriesList>
            <EntriesHeader>
              <EntriesTitle>
                Recent Entries
              </EntriesTitle>
            </EntriesHeader>

            {entries.slice(0, 5).map((entry, index) => (
              <EntryCard
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EntryMood style={{ background: `${moodColors[entry.mood_score - 1]}15` }}>
                  {moodEmojis[entry.mood_score - 1]}
                </EntryMood>
                <EntryContent>
                  <EntryDate>
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric'
                    })}
                  </EntryDate>
                  {entry.note && <EntryNote>{entry.note}</EntryNote>}
                  {entry.activities && entry.activities.length > 0 && (
                    <EntryActivities>
                      {entry.activities.map(a => (
                        <ActivityTag key={a}>
                          {activities.find(act => act.id === a)?.label || a}
                        </ActivityTag>
                      ))}
                    </EntryActivities>
                  )}
                </EntryContent>
              </EntryCard>
            ))}
          </EntriesList>
        )}
      </Container>
    </PageWrapper>
  );
}
