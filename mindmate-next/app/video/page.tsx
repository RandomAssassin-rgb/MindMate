'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Video, Phone, Calendar, Clock, Shield, Check, User, Star, Award, ChevronRight, X, Mic, MicOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 50%, #FFFBF7 100%);
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(180deg, #DBEAFE 0%, #EFF6FF 100%);
  position: relative;
  overflow: hidden;
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=800&fit=crop') center/cover;
  opacity: 0.08;
  z-index: 0;
`;

const PageIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(36px, 5vw, 52px);
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  
  span {
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto 32px;
  position: relative;
  z-index: 1;
`;

const FeatureGrid = styled(motion.div)`
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
  font-weight: 500;
  
  svg {
    color: ${({ theme }) => theme.colors.success};
  }
`;

const CounselorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 28px;
  margin-top: 60px;
`;

const CounselorCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  }
`;

const CounselorHeader = styled.div<{ available: boolean }>`
  background: ${({ available }) => available
    ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
    : 'linear-gradient(135deg, #6B7280, #4B5563)'};
  padding: 28px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const CounselorAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;

const CounselorHeaderInfo = styled.div`
  color: white;
`;

const CounselorName = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const CounselorTitle = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const CounselorBody = styled.div`
  padding: 24px;
`;

const CounselorSpecialties = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const SpecialtyTag = styled.span`
  padding: 6px 14px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const CounselorStats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: #F59E0B;
  }
`;

const AvailabilityBadge = styled.div<{ available: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${({ available }) => available ? '#DCFCE7' : '#FEE2E2'};
  color: ${({ available }) => available ? '#16A34A' : '#DC2626'};
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const CounselorActions = styled.div`
  display: flex;
  gap: 12px;
`;

// Video Modal
const VideoModal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #0F172A;
  z-index: 200;
  display: flex;
  flex-direction: column;
`;

const VideoHeader = styled.div`
  padding: 20px 24px;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VideoInfo = styled.div`
  color: white;
  
  h3 {
    font-size: 18px;
    margin-bottom: 2px;
  }
  
  span {
    font-size: 14px;
    color: #94A3B8;
  }
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const VideoArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MainVideo = styled.div`
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #1E293B, #334155);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 24px;
  position: relative;
`;

const VideoAvatar = styled.div`
  font-size: 80px;
  margin-bottom: 16px;
`;

const VideoName = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

const VideoStatus = styled.div`
  font-size: 16px;
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #22C55E;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const SelfVideo = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 200px;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
`;

const VideoControls = styled.div`
  padding: 24px;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const ControlButton = styled.button<{ danger?: boolean; active?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: ${({ danger, active }) =>
    danger ? '#EF4444' :
      active ? '#22C55E' :
        'rgba(255,255,255,0.15)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ danger, active }) =>
    danger ? '#DC2626' :
      active ? '#16A34A' :
        'rgba(255,255,255,0.25)'};
  }
`;

const counselors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Trauma', 'CBT'],
    avatar: '👩‍⚕️',
    available: true,
    rating: 4.9,
    sessions: 500
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    title: 'Mental Health Counselor',
    specialties: ['Stress', 'Relationships', 'Career', 'Mindfulness'],
    avatar: '👨‍⚕️',
    available: true,
    rating: 4.8,
    sessions: 380
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    title: 'Licensed Therapist',
    specialties: ['CBT', 'Self-Esteem', 'Life Transitions'],
    avatar: '👩‍💼',
    available: false,
    rating: 4.9,
    sessions: 420
  }
];

export default function VideoPage() {
  const [inCall, setInCall] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<typeof counselors[0] | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, delay: 0.3 }
      );
    }
  }, []);

  const startCall = (counselor: typeof counselors[0]) => {
    setSelectedCounselor(counselor);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setSelectedCounselor(null);
    setMicOn(true);
    setVideoOn(true);
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroImage />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageIcon>
              <Video size={36} color="white" />
            </PageIcon>
          </motion.div>

          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Video <span>Consultations</span>
          </HeroTitle>

          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Connect with licensed mental health professionals through secure,
            private video sessions from anywhere, anytime
          </HeroSubtitle>

          <FeatureGrid
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FeatureItem>
              <Check size={20} />
              End-to-end Encrypted
            </FeatureItem>
            <FeatureItem>
              <Check size={20} />
              Licensed Professionals
            </FeatureItem>
            <FeatureItem>
              <Check size={20} />
              Flexible Scheduling
            </FeatureItem>
            <FeatureItem>
              <Check size={20} />
              HIPAA Compliant
            </FeatureItem>
          </FeatureGrid>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" rightIcon={<Calendar size={18} />}>
              Book a Session
            </Button>
          </motion.div>
        </Container>
      </HeroSection>

      <Container>
        <CounselorGrid ref={cardsRef}>
          {counselors.map(counselor => (
            <CounselorCard key={counselor.id}>
              <CounselorHeader available={counselor.available}>
                <CounselorAvatar>{counselor.avatar}</CounselorAvatar>
                <CounselorHeaderInfo>
                  <CounselorName>{counselor.name}</CounselorName>
                  <CounselorTitle>{counselor.title}</CounselorTitle>
                </CounselorHeaderInfo>
              </CounselorHeader>

              <CounselorBody>
                <CounselorSpecialties>
                  {counselor.specialties.map(s => (
                    <SpecialtyTag key={s}>{s}</SpecialtyTag>
                  ))}
                </CounselorSpecialties>

                <CounselorStats>
                  <StatItem>
                    <Star size={16} fill="#F59E0B" />
                    {counselor.rating} rating
                  </StatItem>
                  <StatItem>
                    <Award size={16} />
                    {counselor.sessions}+ sessions
                  </StatItem>
                </CounselorStats>

                <AvailabilityBadge available={counselor.available}>
                  {counselor.available ? '● Available Now' : '○ Currently Busy'}
                </AvailabilityBadge>

                <CounselorActions>
                  <Button
                    disabled={!counselor.available}
                    onClick={() => startCall(counselor)}
                    leftIcon={<Video size={18} />}
                    style={{ flex: 1 }}
                  >
                    Start Call
                  </Button>
                  <Link href="/schedule" style={{ flex: 1 }}>
                    <Button
                      variant="secondary"
                      leftIcon={<Calendar size={18} />}
                      style={{ width: '100%' }}
                    >
                      Schedule
                    </Button>
                  </Link>
                </CounselorActions>
              </CounselorBody>
            </CounselorCard>
          ))}
        </CounselorGrid>
      </Container>

      {/* Video Call Modal */}
      <AnimatePresence>
        {inCall && selectedCounselor && (
          <VideoModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VideoHeader>
              <VideoInfo>
                <h3>{selectedCounselor.name}</h3>
                <span>{selectedCounselor.title}</span>
              </VideoInfo>
              <CloseButton onClick={endCall}>
                <X size={24} />
              </CloseButton>
            </VideoHeader>

            <VideoArea>
              <MainVideo>
                <VideoAvatar>{selectedCounselor.avatar}</VideoAvatar>
                <VideoName>{selectedCounselor.name}</VideoName>
                <VideoStatus>Connected</VideoStatus>

                <SelfVideo>
                  <User size={32} />
                </SelfVideo>
              </MainVideo>
            </VideoArea>

            <VideoControls>
              <ControlButton
                active={micOn}
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </ControlButton>

              <ControlButton
                active={videoOn}
                onClick={() => setVideoOn(!videoOn)}
              >
                {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </ControlButton>

              <ControlButton danger onClick={endCall}>
                <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
              </ControlButton>
            </VideoControls>
          </VideoModal>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
