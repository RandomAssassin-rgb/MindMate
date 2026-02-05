'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Shield, LogOut, ArrowLeft, Heart,
  Zap, Award, Target, TrendingUp, Flame, Star, MessageCircle,
  Smile, Meh, Frown, Sun, Moon, CloudRain
} from 'lucide-react';
import Link from 'next/link';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF9F5 0%, #FFF0E8 50%, #FFE8DB 100%);
`;

const ProfileContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 32px;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  transition: all 0.2s;

  &:hover {
    color: #FF6A09;
    background: white;
    transform: translateX(-4px);
  }
`;

const HeroCard = styled(motion.div)`
  background: linear-gradient(135deg, #FF8A4C 0%, #FF6A09 50%, #F05A00 100%);
  border-radius: 32px;
  padding: 48px;
  position: relative;
  overflow: hidden;
  color: white;
  margin-bottom: 32px;
  box-shadow: 0 20px 60px rgba(255, 106, 9, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  border: 4px solid rgba(255,255,255,0.5);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
`;

const StatusBadge = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 28px;
  height: 28px;
  background: #10B981;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Greeting = styled.div`
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 4px;
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const EmailBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 100px;
  font-size: 14px;
  backdrop-filter: blur(8px);
`;

const QuickStats = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const QuickStat = styled.div`
  text-align: center;
`;

const QuickStatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
`;

const QuickStatLabel = styled.div`
  font-size: 13px;
  opacity: 0.8;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border: 1px solid rgba(255, 106, 9, 0.08);
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1B1B1B;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div<{ bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Mood Chart
const MoodWeek = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const MoodDay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const MoodIcon = styled.div<{ mood: 'great' | 'good' | 'okay' | 'low' }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => ({
    great: 'linear-gradient(135deg, #10B981, #059669)',
    good: 'linear-gradient(135deg, #34D399, #10B981)',
    okay: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
    low: 'linear-gradient(135deg, #94A3B8, #64748B)'
  }[props.mood])};
  color: white;
  box-shadow: 0 4px 12px ${props => ({
    great: 'rgba(16, 185, 129, 0.3)',
    good: 'rgba(52, 211, 153, 0.3)',
    okay: 'rgba(251, 191, 36, 0.3)',
    low: 'rgba(148, 163, 184, 0.3)'
  }[props.mood])};
`;

const DayLabel = styled.div`
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
`;

// Streak
const StreakBanner = styled.div`
  background: linear-gradient(135deg, #FF8A4C 0%, #FF6A09 100%);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const StreakInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StreakIcon = styled.div`
  width: 56px;
  height: 56px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
`;

const StreakText = styled.div``;

const StreakNumber = styled.div`
  font-size: 32px;
  font-weight: 800;
`;

const StreakLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

// Badges
const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Badge = styled(motion.div) <{ earned: boolean }>`
  aspect-ratio: 1;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  background: ${props => props.earned
    ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
    : '#F9FAFB'};
  border: 2px solid ${props => props.earned ? '#FDBA74' : '#E5E7EB'};
  opacity: ${props => props.earned ? 1 : 0.5};
  transition: all 0.2s;

  &:hover {
    transform: ${props => props.earned ? 'scale(1.05)' : 'none'};
  }
`;

const BadgeIcon = styled.div`
  font-size: 28px;
`;

const BadgeName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  text-align: center;
`;

// Info Rows
const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #F9FAFB;
  border-radius: 12px;
`;

const InfoLabel = styled.span`
  color: #6B7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoValue = styled.span`
  color: #1F2937;
  font-weight: 600;
  font-size: 14px;
`;

// Actions
const ActionButton = styled(motion.button) <{ variant?: 'primary' | 'danger' }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;

  ${props => props.variant === 'danger' ? `
    background: #FEF2F2;
    color: #DC2626;
    &:hover { background: #FEE2E2; }
  ` : `
    background: linear-gradient(135deg, #FF8A4C 0%, #FF6A09 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(255, 106, 9, 0.3);
    &:hover { 
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 106, 9, 0.4);
    }
  `}
`;

// Badge data
const badges = [
  { icon: '🌟', name: 'First Check-in', earned: true },
  { icon: '🔥', name: '7-Day Streak', earned: true },
  { icon: '💬', name: 'Community Star', earned: true },
  { icon: '🎯', name: 'Goal Crusher', earned: false },
  { icon: '🧘', name: 'Mindful Master', earned: false },
  { icon: '💪', name: 'Resilient', earned: true },
  { icon: '🌈', name: 'Positivity Pro', earned: false },
  { icon: '🏆', name: 'Champion', earned: false },
];

// Mood data for the week
const weekMoods: { day: string; mood: 'great' | 'good' | 'okay' | 'low' }[] = [
  { day: 'Mon', mood: 'good' },
  { day: 'Tue', mood: 'great' },
  { day: 'Wed', mood: 'okay' },
  { day: 'Thu', mood: 'good' },
  { day: 'Fri', mood: 'great' },
  { day: 'Sat', mood: 'good' },
  { day: 'Sun', mood: 'great' },
];

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case 'great': return <Sun size={22} />;
    case 'good': return <Smile size={22} />;
    case 'okay': return <Meh size={22} />;
    case 'low': return <CloudRain size={22} />;
    default: return <Smile size={22} />;
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return null;
  if (!user) return null;

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Friend';

  return (
    <PageWrapper>
      <ProfileContainer>
        <BackLink href="/">
          <ArrowLeft size={18} />
          Back to Home
        </BackLink>

        <HeroCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroContent>
            <AvatarWrapper>
              <Avatar
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {user.email?.[0].toUpperCase()}
              </Avatar>
              <StatusBadge>
                <Zap size={14} color="white" />
              </StatusBadge>
            </AvatarWrapper>
            <UserInfo>
              <Greeting>{getGreeting()},</Greeting>
              <Name>{user.user_metadata?.full_name || 'MindMate User'}</Name>
              <EmailBadge>
                <Mail size={14} />
                {user.email}
              </EmailBadge>
              <QuickStats>
                <QuickStat>
                  <QuickStatValue>12</QuickStatValue>
                  <QuickStatLabel>Check-ins</QuickStatLabel>
                </QuickStat>
                <QuickStat>
                  <QuickStatValue>5</QuickStatValue>
                  <QuickStatLabel>Day Streak</QuickStatLabel>
                </QuickStat>
                <QuickStat>
                  <QuickStatValue>4</QuickStatValue>
                  <QuickStatLabel>Badges</QuickStatLabel>
                </QuickStat>
              </QuickStats>
            </UserInfo>
          </HeroContent>
        </HeroCard>

        <ContentGrid>
          {/* Mood This Week */}
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <CardTitle>
              <IconWrapper bg="linear-gradient(135deg, #A78BFA, #8B5CF6)">
                <TrendingUp size={20} color="white" />
              </IconWrapper>
              Mood This Week
            </CardTitle>
            <MoodWeek>
              {weekMoods.map((day) => (
                <MoodDay key={day.day}>
                  <MoodIcon mood={day.mood}>
                    {getMoodIcon(day.mood)}
                  </MoodIcon>
                  <DayLabel>{day.day}</DayLabel>
                </MoodDay>
              ))}
            </MoodWeek>
            <StreakBanner>
              <StreakInfo>
                <StreakIcon>
                  <Flame size={28} />
                </StreakIcon>
                <StreakText>
                  <StreakNumber>5 Days</StreakNumber>
                  <StreakLabel>Current Streak 🔥</StreakLabel>
                </StreakText>
              </StreakInfo>
            </StreakBanner>
          </Card>

          {/* Achievements */}
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <CardTitle>
              <IconWrapper bg="linear-gradient(135deg, #FBBF24, #F59E0B)">
                <Award size={20} color="white" />
              </IconWrapper>
              Achievements
            </CardTitle>
            <BadgeGrid>
              {badges.map((badge, i) => (
                <Badge
                  key={i}
                  earned={badge.earned}
                  whileHover={badge.earned ? { scale: 1.05 } : {}}
                >
                  <BadgeIcon>{badge.icon}</BadgeIcon>
                  <BadgeName>{badge.name}</BadgeName>
                </Badge>
              ))}
            </BadgeGrid>
          </Card>

          {/* Account Info */}
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <CardTitle>
              <IconWrapper bg="linear-gradient(135deg, #60A5FA, #3B82F6)">
                <Shield size={20} color="white" />
              </IconWrapper>
              Account Security
            </CardTitle>
            <InfoList>
              <InfoRow>
                <InfoLabel>Sign-in Method</InfoLabel>
                <InfoValue>{user.app_metadata?.provider || 'Email'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Member Since</InfoLabel>
                <InfoValue>{new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Last Active</InfoLabel>
                <InfoValue>{new Date(user.last_sign_in_at).toLocaleDateString()}</InfoValue>
              </InfoRow>
            </InfoList>
          </Card>

          {/* Quick Actions */}
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <CardTitle>
              <IconWrapper bg="linear-gradient(135deg, #F472B6, #EC4899)">
                <Heart size={20} color="white" />
              </IconWrapper>
              Quick Actions
            </CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/community" style={{ textDecoration: 'none' }}>
                <ActionButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={18} />
                  Go to Community
                </ActionButton>
              </Link>
              <ActionButton
                variant="danger"
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={18} />
                Sign Out
              </ActionButton>
            </div>
          </Card>
        </ContentGrid>
      </ProfileContainer>
    </PageWrapper>
  );
}
