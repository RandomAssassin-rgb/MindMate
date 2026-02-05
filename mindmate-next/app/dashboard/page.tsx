'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sun, Moon, Cloud, Wind, Heart, Zap,
  TrendingUp, Play, BookOpen, MessageCircle,
  Calendar, Check, ArrowRight, Quote, Sparkles, Activity,
  Clock, ChevronRight, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

// --- Styled Components ---

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  position: relative;
  height: 80vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
`;

const ParallaxBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%; // Taller for parallax
  background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 24px;
`;

const Greeting = styled.h1`
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  opacity: 0;
  transform: translateY(30px);

  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const SubGreeting = styled.p`
  font-size: 24px;
  font-weight: 500;
  opacity: 0; // Starts hidden for animation
  transform: translateY(20px);
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  margin-bottom: 40px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
  margin-top: -100px; // Overlap hero
  padding-bottom: 100px;
`;

const Section = styled.section`
  margin-bottom: 120px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionLink = styled(Link)`
  color: #FF6A09;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: gap 0.2s;

  &:hover {
    gap: 12px;
  }
`;

// --- Collections Grid ---
const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const CollectionCard = styled(motion.div) <{ bg: string }>`
  height: 400px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
    transition: all 0.3s;
  }

  &:hover {
    transform: translateY(-8px);
    
    &::before {
      background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%);
    }

    .play-btn {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CollectionContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 32px;
  color: white;
  z-index: 10;
`;

const CollectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const CollectionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  opacity: 0.9;
`;

const PlayIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF6A09;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
`;

// --- Widget Grid ---
const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); // Deeper shadow
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 240px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  // Decorative gradient blob
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
  }

  &:hover {
    transform: translateY(-4px);
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }
  
  .value {
    font-size: 56px;
    font-weight: 800;
    color: #0F172A;
    margin: 16px 0;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    z-index: 1;
  }
  
  .footer {
    font-size: 15px;
    font-weight: 500;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    
    &.up { 
      color: #059669; 
      background: rgba(16, 185, 129, 0.1);
      padding: 6px 12px;
      border-radius: 20px;
      width: fit-content;
    }
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const QuickAction = styled(Link) <{ color: string }>`
  background: white;
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.02);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.color};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    
    &::before {
      opacity: 0.05;
    }

    .icon {
      transform: scale(1.1) rotate(-5deg);
      background: ${props => props.color};
      color: white;
      box-shadow: 0 8px 20px ${props => props.color}40; // Colored shadow
    }
  }
  
  .icon {
    width: 56px;
    height: 56px;
    border-radius: 20px;
    background: ${props => props.color}15; // 15% opacity
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    font-size: 24px;
  }
  
  .label {
    font-weight: 700;
    color: #1E293B;
    font-size: 16px;
    position: relative;
    z-index: 1;
  }
`;

// --- Journey Map ---
const JourneyContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px;
  border: 1px solid #E2E8F0;
`;

const JourneySteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    height: 4px;
    background: #E2E8F0;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    
    &::before {
      top: 0;
      bottom: 0;
      left: 24px;
      width: 4px;
      height: auto;
    }
  }
`;

const Step = styled(motion.div) <{ completed?: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
  opacity: 0;
  transform: translateY(20px);
  
  @media (max-width: 768px) {
    flex-direction: row;
    opacity: 1;
    transform: none;
  }
`;

const StepCircle = styled.div<{ completed?: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${props => props.completed ? '#10B981' : 'white'};
  border: 4px solid ${props => props.completed ? '#10B981' : '#E2E8F0'};
  color: ${props => props.completed ? 'white' : '#94A3B8'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.3s;
`;

const StepContent = styled.div`
  text-align: center;
  
  h4 {
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 14px;
    color: #64748B;
  }
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

// --- Articles ---
const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

const ArticleCard = styled.a`
  display: block;
  text-decoration: none;
  
  &:hover {
    .image-wrapper img {
      transform: scale(1.05);
    }
    h3 {
      color: #FF6A09;
    }
  }
`;

const ImageWrapper = styled.div`
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
  height: 240px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
`;

const ArticleTag = styled.span`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #FF6A09;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  display: block;
`;

const ArticleTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
  transition: color 0.2s;
`;

const ArticleExcerpt = styled.p`
  color: #64748B;
  line-height: 1.6;
`;

import { useRouter } from 'next/navigation';

// ... (imports)

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    }).catch((err) => {
      console.error('Error fetching user:', err);
      router.push('/login');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      // Parallax Hero
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Hero Text Entrance
      gsap.fromTo(".hero-text-anim",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      // Stagger Sections
      gsap.utils.toArray<HTMLElement>('.dashboard-section').forEach(section => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Journey Steps Stagger
      gsap.fromTo(".journey-step",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
          scrollTrigger: {
            trigger: ".journey-container",
            start: "top 70%"
          }
        }
      );
    }
  }, [loading]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #E2E8F0', borderTopColor: '#FF6A09', borderRadius: '50%' }} />
    </div>
  );

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Friend';
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <DashboardWrapper>
      {/* Hero */}
      <HeroSection ref={heroRef}>
        <ParallaxBg ref={bgRef} />
        <HeroContent>
          <Greeting className="hero-text-anim">
            {greeting}, {firstName}
          </Greeting>
          <SubGreeting className="hero-text-anim">
            Your mind is a garden. Let's tend to it today.
          </SubGreeting>
          <div className="hero-text-anim">
            <Link href="/mood">
              <Button size="lg" style={{ background: 'white', color: 'black', border: 'none' }}>
                Start Daily Check-in
              </Button>
            </Link>
          </div>
        </HeroContent>
      </HeroSection>

      <ContentContainer>
        {/* 1. Overview Widgets */}
        <Section className="dashboard-section">
          <WidgetGrid>
            <StatCard>
              <div>
                <h3><Activity size={20} /> Weekly Progress</h3>
                <div className="value">85%</div>
                <div className="footer up">
                  <TrendingUp size={16} /> 12% boost
                </div>
              </div>
              <div style={{ marginTop: 24, padding: '4px', background: '#F1F5F9', borderRadius: '12px' }}>
                <div style={{
                  width: '85%',
                  height: '12px',
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)'
                }} />
              </div>
            </StatCard>

            <ActionGrid>
              <QuickAction href="/relax" color="#10B981">
                <span className="icon"><Wind size={28} /></span>
                <span className="label">Breathe</span>
              </QuickAction>
              <QuickAction href="/community" color="#6366F1">
                <span className="icon"><MessageCircle size={28} /></span>
                <span className="label">Community</span>
              </QuickAction>
              <QuickAction href="/mood" color="#F43F5E">
                <span className="icon"><Heart size={28} /></span>
                <span className="label">Mood</span>
              </QuickAction>
              <QuickAction href="/video/book" color="#F59E0B">
                <span className="icon"><Calendar size={28} /></span>
                <span className="label">Schedule</span>
              </QuickAction>
            </ActionGrid>
          </WidgetGrid>
        </Section>

        {/* 2. Featured Collections */}
        <Section className="dashboard-section">
          <SectionHeader>
            <SectionTitle><Sparkles size={28} color="#FF6A09" /> Curated for You</SectionTitle>
            <SectionLink href="/relax">View Library <ChevronRight size={20} /></SectionLink>
          </SectionHeader>
          <CollectionGrid>
            <Link href="/relax" style={{ textDecoration: 'none' }}>
              <CollectionCard bg="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2664&auto=format&fit=crop">
                <PlayIconWrapper className="play-btn"><Play size={24} fill="currentColor" /></PlayIconWrapper>
                <CollectionContent>
                  <CollectionTitle>Anxiety SOS</CollectionTitle>
                  <CollectionMeta><Clock size={16} /> 5 min • Emergency Relief</CollectionMeta>
                </CollectionContent>
              </CollectionCard>
            </Link>

            <Link href="/relax" style={{ textDecoration: 'none' }}>
              <CollectionCard bg="https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=2820&auto=format&fit=crop">
                <PlayIconWrapper className="play-btn"><Play size={24} fill="currentColor" /></PlayIconWrapper>
                <CollectionContent>
                  <CollectionTitle>Deep Sleep</CollectionTitle>
                  <CollectionMeta><Clock size={16} /> 45 min • Sleep Story</CollectionMeta>
                </CollectionContent>
              </CollectionCard>
            </Link>

            <Link href="/relax" style={{ textDecoration: 'none' }}>
              <CollectionCard bg="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop">
                <PlayIconWrapper className="play-btn"><Play size={24} fill="currentColor" /></PlayIconWrapper>
                <CollectionContent>
                  <CollectionTitle>Morning Focus</CollectionTitle>
                  <CollectionMeta><Clock size={16} /> 15 min • Meditation</CollectionMeta>
                </CollectionContent>
              </CollectionCard>
            </Link>
          </CollectionGrid>
        </Section>

        {/* 3. Daily Journey */}
        <Section className="dashboard-section">
          <SectionTitle style={{ marginBottom: 32 }}>Your Daily Journey</SectionTitle>
          <JourneyContainer className="journey-container">
            <JourneySteps>
              <Step className="journey-step" completed>
                <StepCircle completed><Check size={28} /></StepCircle>
                <StepContent>
                  <h4>Morning Check-in</h4>
                  <p>Completed at 8:30 AM</p>
                </StepContent>
              </Step>
              <Step className="journey-step">
                <StepCircle>2</StepCircle>
                <StepContent>
                  <h4>Midday Reset</h4>
                  <p>Recommended: 5 min breathe</p>
                </StepContent>
              </Step>
              <Step className="journey-step">
                <StepCircle>3</StepCircle>
                <StepContent>
                  <h4>Evening Reflection</h4>
                  <p>Log your mood</p>
                </StepContent>
              </Step>
            </JourneySteps>
          </JourneyContainer>
        </Section>

        {/* 4. Daily Discoveries */}
        <Section className="dashboard-section">
          <SectionHeader>
            <SectionTitle><BookOpen size={28} color="#FF6A09" /> Daily Discoveries</SectionTitle>
            <SectionLink href="/learn">Read More <ChevronRight size={20} /></SectionLink>
          </SectionHeader>
          <ArticleGrid>
            <ArticleCard href="#">
              <ImageWrapper>
                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop" alt="Yoga" />
              </ImageWrapper>
              <ArticleTag>Wellness</ArticleTag>
              <ArticleTitle>The Science of Mindfulness</ArticleTitle>
              <ArticleExcerpt>How 10 minutes a day can physically change your brain structure for the better.</ArticleExcerpt>
            </ArticleCard>

            <ArticleCard href="#">
              <ImageWrapper>
                <img src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=2000&auto=format&fit=crop" alt="Healthy Food" />
              </ImageWrapper>
              <ArticleTag>Nutrition</ArticleTag>
              <ArticleTitle>Foods That Boost Mood</ArticleTitle>
              <ArticleExcerpt>Discover the gut-brain connection and what to eat to feel your best.</ArticleExcerpt>
            </ArticleCard>

            <ArticleCard href="#">
              <ImageWrapper>
                <img src="https://images.unsplash.com/photo-1499209974431-2761e25236d6?q=80&w=2000&auto=format&fit=crop" alt="Nature" />
              </ImageWrapper>
              <ArticleTag>Nature</ArticleTag>
              <ArticleTitle>Forest Bathing Guide 101</ArticleTitle>
              <ArticleExcerpt>Why stepping outside might be the best therapy you can find.</ArticleExcerpt>
            </ArticleCard>
          </ArticleGrid>
        </Section>
      </ContentContainer>
    </DashboardWrapper>
  );
}
