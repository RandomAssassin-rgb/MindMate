'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Heart, Moon, Cloud, Brain, Play, Clock, Pause, Volume2, SkipBack, SkipForward, X, Waves, Wind, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding-bottom: 100px;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 50%, ${({ theme }) => theme.colors.bg} 100%);
  position: relative;
  overflow: hidden;
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=800&fit=crop') center/cover;
  opacity: 0.15;
  z-index: 0;
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(36px, 5vw, 56px);
  margin-bottom: 16px;
  background: linear-gradient(135deg, #0EA5E9, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 500px;
  margin: 0 auto 40px;
`;

// Breathing Widget
const BreathingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 60px;
`;

const BreathingCircle = styled(motion.div) <{ phase: string }>`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: ${({ phase }) =>
    phase === 'inhale' ? 'linear-gradient(135deg, #38BDF8, #0EA5E9)' :
      phase === 'hold' ? 'linear-gradient(135deg, #0EA5E9, #0284C7)' :
        'linear-gradient(135deg, #BAE6FD, #7DD3FC)'};
  border: 4px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 60px rgba(56, 189, 248, 0.4);
  transition: background 0.5s ease;
`;

const BreathText = styled.span`
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const BreathTimer = styled.div`
  font-size: 48px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
`;

// Category Tabs
const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const CategoryTab = styled(motion.button) <{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 100px;
  border: 2px solid ${({ active, theme }) => active ? 'transparent' : theme.colors.border};
  background: ${({ active }) => active ? 'linear-gradient(135deg, #0EA5E9, #3B82F6)' : 'white'};
  color: ${({ active }) => active ? 'white' : '#64748B'};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => active ? '0 8px 24px rgba(14, 165, 233, 0.35)' : '0 2px 8px rgba(0,0,0,0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

// Content Sections
const ContentSection = styled.section`
  padding: 40px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionIcon = styled.span<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`;

// Card Grid
const CardGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

// Audio Card
const AudioCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }
`;

const AudioThumb = styled.div<{ image: string }>`
  height: 180px;
  background: url(${({ image }) => image}) center/cover;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5));
  }
`;

const PlayButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 2;
  
  svg {
    color: #0EA5E9;
    margin-left: 4px;
  }
`;

const AudioDuration = styled.span`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AudioInfo = styled.div`
  padding: 20px;
`;

const AudioTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text};
`;

const AudioMeta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

// Full Screen Player
const PlayerOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const PlayerImage = styled.div<{ image: string }>`
  width: 300px;
  height: 300px;
  border-radius: 24px;
  background: url(${({ image }) => image}) center/cover;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  margin-bottom: 40px;
`;

const PlayerTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 8px;
`;

const PlayerCategory = styled.div`
  font-size: 16px;
  color: #94A3B8;
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #0EA5E9, #3B82F6);
  border-radius: 3px;
`;

const ProgressTime = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 32px;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ControlButton = styled(motion.button) <{ primary?: boolean }>`
  width: ${({ primary }) => primary ? '72px' : '48px'};
  height: ${({ primary }) => primary ? '72px' : '48px'};
  border-radius: 50%;
  border: none;
  background: ${({ primary }) => primary ? 'linear-gradient(135deg, #0EA5E9, #3B82F6)' : 'rgba(255,255,255,0.1)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: ${({ primary }) => primary ? 'linear-gradient(135deg, #0284C7, #2563EB)' : 'rgba(255,255,255,0.2)'};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
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

const categories = [
  { id: 'all', label: 'All', icon: Heart },
  { id: 'Sleep', label: 'Sleep Stories', icon: Moon },
  { id: 'Meditation', label: 'Meditation', icon: Brain },
  { id: 'Sounds', label: 'Nature Sounds', icon: Waves },
  { id: 'Focus', label: 'Focus Music', icon: Sun }
];

// Category-based images from Unsplash
const categoryImages: Record<string, string[]> = {
  Sleep: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1455793067330-6c82c57eed56?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&h=400&fit=crop'
  ],
  Meditation: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop'
  ],
  Sounds: [
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=400&fit=crop'
  ],
  Focus: [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop'
  ]
};

const getImageForTrack = (track: { category: string; id: string }) => {
  const images = categoryImages[track.category] || categoryImages.Meditation;
  const index = parseInt(track.id, 36) % images.length;
  return images[index];
};

interface Track {
  id: string;
  title: string;
  category: string;
  duration_sec: number;
  audio_url: string;
  description?: string;
}

// Demo tracks for when Supabase is empty
const demoTracks: Track[] = [
  // Sleep Stories
  { id: 's1', title: 'Bedtime Story: The Star', category: 'Sleep', duration_sec: 1200, audio_url: '/audio/lofi.mp3', description: 'A classic calming bedtime story.' },
  { id: 's2', title: 'Ocean Dreams', category: 'Sleep', duration_sec: 900, audio_url: '/audio/rain.ogg', description: 'Drift off to the sound of gentle waves' },

  // Meditation
  { id: 'm1', title: 'Box Breathing Guide', category: 'Meditation', duration_sec: 300, audio_url: '/audio/rain.ogg', description: 'Deep flowing water for breathing focus.' },
  { id: 'm2', title: 'Morning Positivity', category: 'Meditation', duration_sec: 600, audio_url: '/audio/rain.ogg', description: 'Start your day with positive energy.' },
  { id: 'm3', title: 'Body Scan Relaxation', category: 'Meditation', duration_sec: 1200, audio_url: '/audio/rain.ogg', description: 'Progressive relaxation with forest sounds.' },

  // Nature Sounds
  { id: 'n1', title: 'Forest Ambience', category: 'Sounds', duration_sec: 3600, audio_url: '/audio/rain.ogg', description: 'Immersive forest sounds.' },
  { id: 'n2', title: 'Ocean Waves', category: 'Sounds', duration_sec: 3600, audio_url: '/audio/rain.ogg', description: 'Rhythmic waves on a sandy beach' },
  { id: 'n3', title: 'Gentle Rain', category: 'Sounds', duration_sec: 3600, audio_url: '/audio/rain.ogg', description: 'Soft rainfall for relaxation' },

  // Focus Music
  { id: 'f1', title: 'Deep Focus Alpha', category: 'Focus', duration_sec: 2700, audio_url: '/audio/lofi.mp3', description: 'Alpha waves for deep concentration.' },
  { id: 'f2', title: 'Lo-Fi Focus Beats', category: 'Focus', duration_sec: 3600, audio_url: '/audio/lofi.mp3', description: 'Chill beats for studying and work.' }
];

export default function RelaxPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [tracks, setTracks] = useState<Track[]>(demoTracks);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathActive, setBreathActive] = useState(false);
  const [breathCount, setBreathCount] = useState(4);
  const cardsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch tracks from Supabase, fall back to demo data
  useEffect(() => {
    async function fetchTracks() {
      // Force use of local curated tracks for now to ensure quality match
      setTracks(demoTracks);
      setLoading(false);

      /* 
      try {
        const { data, error } = await supabase.from('meditations').select('*');
        if (error) throw error;
        // Use Supabase data if available, otherwise keep demo data
        if (data && data.length > 0) {
          setTracks(data);
        }
      } catch (error) {
        console.log('Using demo tracks (Supabase not connected)');
      } finally {
        setLoading(false);
      }
      */
    }
    fetchTracks();
  }, []);


  // Breathing animation
  useEffect(() => {
    if (!breathActive) return;

    const durations: Record<string, number> = { inhale: 4000, hold: 4000, exhale: 4000 };
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';

    const cycle = () => {
      setBreathPhase(phase);
      let count = 4;
      const countInterval = setInterval(() => {
        count--;
        setBreathCount(count);
        if (count === 0) {
          clearInterval(countInterval);
          phase = phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale';
          setTimeout(cycle, 100);
        }
      }, 1000);
    };

    cycle();
    return () => { };
  }, [breathActive]);

  // GSAP card animations
  useEffect(() => {
    if (cardsRef.current && !loading) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out'
        }
      );
    }
  }, [loading, activeCategory]);

  // Handle Audio Playback
  useEffect(() => {
    if (currentTrack?.audio_url && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Simulate progress when playing (ONLY for demo tracks)
  useEffect(() => {
    if (isPlaying && currentTrack && !currentTrack.audio_url) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / currentTrack.duration_sec);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current && currentTrack?.audio_url) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;

      if (Number.isFinite(duration) && duration > 0) {
        setProgress((current / duration) * 100);
      }

      if (Number.isFinite(duration) && current >= duration) {
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);

    if (currentTrack.audio_url && audioRef.current) {
      // Only seek if duration is valid
      const duration = audioRef.current.duration;
      if (Number.isFinite(duration)) {
        const time = (percentage / 100) * duration;
        if (Number.isFinite(time)) {
          audioRef.current.currentTime = time;
        }
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (!currentTrack) return;

    if (currentTrack.audio_url && audioRef.current) {
      const duration = audioRef.current.duration;
      if (Number.isFinite(duration)) {
        audioRef.current.currentTime += seconds;
      }
    } else {
      // For demo tracks without URL, just adjust progress percentage
      const percentChange = (seconds / currentTrack.duration_sec) * 100;
      setProgress(p => Math.min(100, Math.max(0, p + percentChange)));
    }
  };

  const filteredTracks = activeCategory === 'all'
    ? tracks
    : tracks.filter(t => t.category === activeCategory);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageWrapper>
      {/* Hero */}
      <HeroSection>
        <HeroImage />
        <Container>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Inner Peace
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore guided meditations, sleep stories, and calming sounds to help you relax and recharge
          </HeroSubtitle>

          {/* Breathing Widget */}
          <BreathingSection>
            <BreathingCircle
              phase={breathPhase}
              animate={breathActive ? {
                scale: breathPhase === 'exhale' ? 1 : 1.25
              } : { scale: 1 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
            >
              <BreathText>
                {breathActive ? breathPhase : 'Breathe'}
              </BreathText>
            </BreathingCircle>

            {breathActive && (
              <BreathTimer>{breathCount}</BreathTimer>
            )}

            <Button
              variant={breathActive ? 'secondary' : 'primary'}
              onClick={() => {
                setBreathActive(!breathActive);
                setBreathCount(4);
              }}
            >
              {breathActive ? 'Stop Exercise' : 'Start Breathing Exercise'}
            </Button>
          </BreathingSection>

          {/* Category Tabs */}
          <CategoryTabs>
            {categories.map(cat => (
              <CategoryTab
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <cat.icon size={18} />
                {cat.label}
              </CategoryTab>
            ))}
          </CategoryTabs>
        </Container>
      </HeroSection>

      {/* Content */}
      <Container>
        <ContentSection>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon color="#0EA5E9">
                <Heart size={24} />
              </SectionIcon>
              {activeCategory === 'all' ? 'All Sessions' : categories.find(c => c.id === activeCategory)?.label}
            </SectionTitle>
          </SectionHeader>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
              Loading meditation library...
            </div>
          ) : filteredTracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
              No sessions found. Check your Supabase connection.
            </div>
          ) : (
            <CardGrid ref={cardsRef}>
              {filteredTracks.map(track => (
                <AudioCard
                  key={track.id}
                  onClick={() => playTrack(track)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AudioThumb image={getImageForTrack(track)}>
                    <PlayButton whileHover={{ scale: 1.1 }}>
                      <Play size={28} />
                    </PlayButton>
                    <AudioDuration>
                      <Clock size={12} />
                      {Math.floor(track.duration_sec / 60)} min
                    </AudioDuration>
                  </AudioThumb>
                  <AudioInfo>
                    <AudioTitle>{track.title}</AudioTitle>
                    <AudioMeta>{track.category}</AudioMeta>
                  </AudioInfo>
                </AudioCard>
              ))}
            </CardGrid>
          )}
        </ContentSection>
      </Container>

      {/* Full Screen Player */}
      <AnimatePresence>
        {currentTrack && (
          <PlayerOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloseButton onClick={() => {
              setCurrentTrack(null);
              setIsPlaying(false);
              setProgress(0);
            }}>
              <X size={24} />
            </CloseButton>

            {currentTrack.audio_url && (
              <audio
                key={currentTrack.id}
                ref={audioRef}
                src={currentTrack.audio_url}
                autoPlay
                crossOrigin="anonymous"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={() => {
                  // Ensure duration is set when metadata loads
                  if (audioRef.current) {
                    audioRef.current.play().catch(e => console.log('Autoplay blocked:', e));
                    setIsPlaying(true);
                  }
                }}
                onError={(e) => {
                  console.error("Audio error:", e.currentTarget.error);
                  setIsPlaying(false);
                }}
              />
            )}

            <PlayerImage image={getImageForTrack(currentTrack)} />

            <PlayerTitle>{currentTrack.title}</PlayerTitle>
            <PlayerCategory>{currentTrack.category}</PlayerCategory>

            <ProgressBar onClick={handleSeek} style={{ cursor: 'pointer' }}>
              <ProgressFill style={{ width: `${progress}%` }} />
            </ProgressBar>

            <ProgressTime>
              <span>{formatTime(Math.floor(currentTrack.duration_sec * progress / 100))}</span>
              <span>{formatTime(currentTrack.duration_sec)}</span>
            </ProgressTime>

            <PlayerControls>
              <ControlButton whileHover={{ scale: 1.1 }} onClick={() => skipTime(-15)}>
                <SkipBack size={24} />
              </ControlButton>

              <ControlButton
                primary
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.05 }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
              </ControlButton>

              <ControlButton whileHover={{ scale: 1.1 }} onClick={() => skipTime(15)}>
                <SkipForward size={24} />
              </ControlButton>
            </PlayerControls>
          </PlayerOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
