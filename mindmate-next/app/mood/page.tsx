'use client';

import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Plus, TrendingUp, Calendar, Smile, Heart, Zap, Moon, Coffee, Users, Book, Dumbbell, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

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
  border: 1px solid ${({ theme }) => theme.colors.border};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
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
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 100px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
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
  { id: 'outdoors', label: 'Outdoors', icon: TrendingUp }
];

interface MoodEntry {
  id: string;
  mood: number;
  note: string | null;
  activities: string[] | null;
  created_at: string;
}

// Sample chart data
const chartData = [
  { day: 'Mon', mood: 3, fill: '#FF6A00' },
  { day: 'Tue', mood: 4, fill: '#FF6A00' },
  { day: 'Wed', mood: 3, fill: '#FF6A00' },
  { day: 'Thu', mood: 5, fill: '#FF6A00' },
  { day: 'Fri', mood: 4, fill: '#FF6A00' },
  { day: 'Sat', mood: 4, fill: '#FF6A00' },
  { day: 'Sun', mood: 5, fill: '#FF6A00' }
];

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, delay: 0.3 }
      );
    }
  }, []);

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId]
    );
  };

  const saveMood = async () => {
    if (selectedMood === null) return;

    setLoading(true);
    try {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        note: note || null,
        activities: selectedActivities.length > 0 ? selectedActivities : null,
        created_at: new Date().toISOString()
      };

      setEntries(prev => [newEntry, ...prev]);
      setSelectedMood(null);
      setSelectedActivities([]);
      setNote('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)
    : '–';

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
          <QuickLogCard padding="none">
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
                leftIcon={saved ? <Check size={18} /> : <Plus size={18} />}
                style={{ borderRadius: '14px', height: '52px' }}
              >
                {saved ? 'Saved!' : 'Log My Mood'}
              </Button>
            </LogContent>
          </QuickLogCard>

          {/* Chart */}
          <ChartCard padding="none">
            <ChartHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
                <Calendar size={20} color="#FF6A00" />
                Your Week at a Glance
              </CardTitle>
            </ChartHeader>

            <ChartContent>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="day"
                      stroke="#9CA3AF"
                      fontSize={13}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      stroke="#9CA3AF"
                      fontSize={13}
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
                      formatter={(value: number) => [moodEmojis[value - 1] + ' ' + moodLabels[value - 1], 'Mood']}
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
        {entries.length > 0 && (
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
                <EntryMood style={{ background: `${moodColors[entry.mood - 1]}15` }}>
                  {moodEmojis[entry.mood - 1]}
                </EntryMood>
                <EntryContent>
                  <EntryDate>
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
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
