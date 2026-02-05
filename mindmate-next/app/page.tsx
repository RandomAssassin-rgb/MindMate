'use client';

import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    ArrowRight, Check, Play, Star, Sparkles, Phone, MessageCircle,
    Activity, Heart, Brain, ChevronDown, Lock, Shield, Award, Zap, Users,
    ClipboardCheck, Video, BookOpen
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Styled Components ---

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
`;

const HeroSection = styled.section`
  position: relative;
  padding-top: 140px;
  padding-bottom: 80px;
  overflow: hidden;
  background: radial-gradient(circle at top right, #FFF7ED 0%, #FFFFFF 40%);
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 60px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroContent = styled(motion.div)`
  z-index: 10;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 106, 9, 0.1);
  color: #FF6A09;
  border-radius: 100px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
  margin-bottom: 24px;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(135deg, #FF6A09, #F9BE00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 540px;
  
  @media (max-width: 968px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroCTAs = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const CrisisBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  padding: 16px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 12px;
  width: fit-content;
  
  span {
    font-size: 14px;
    color: #991B1B;
  }

  @media (max-width: 968px) {
    margin: 40px auto 0;
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DecorativeCircle = styled(motion.div) <{ size: number; color: string; top?: string; bottom?: string; left?: string; right?: string }>`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 50%;
  background: ${p => p.color};
  top: ${p => p.top};
  bottom: ${p => p.bottom};
  left: ${p => p.left};
  right: ${p => p.right};
  opacity: 0.2;
  filter: blur(40px);
  z-index: 0;
`;

const FloatingCard = styled(motion.div) <{ position: string }>`
  position: absolute;
  background: white;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  ${p => p.position === 'top-left' ? 'top: 10%; left: 0;' : ''}
  ${p => p.position === 'bottom-right' ? 'bottom: 20%; right: 0;' : ''}
`;

const FloatingCardIcon = styled.div<{ bg: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${p => p.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FloatingCardText = styled.div`
  h5 { font-size: 16px; font-weight: 700; margin: 0; color: #111827; }
  p { font-size: 12px; margin: 0; color: #6B7280; }
`;

const ChatBubble = styled(motion.div)`
  position: absolute;
  top: 30%;
  right: -20px;
  background: #111827;
  color: white;
  padding: 12px 24px;
  border-radius: 20px 20px 20px 4px;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  font-size: 14px;
  z-index: 12;
`;

const PhoneMockup = styled(motion.div)`
  width: 300px;
  height: 580px;
  background: white;
  border-radius: 40px;
  border: 12px solid #111827;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  z-index: 5;
`;

const PhoneScreen = styled.div`
  width: 100%;
  height: 100%;
  background: #F3F4F6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PhoneStatusBar = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 20px;
`;

const PhoneContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PhoneHeader = styled.div`
  h3 { font-size: 20px; margin: 0 0 4px; color: #111827; }
  p { font-size: 13px; margin: 0; color: #6B7280; }
`;

const PhoneCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  
  h4 { font-size: 14px; margin: 0 0 4px; display: flex; gap: 8px; align-items: center; }
  p { font-size: 12px; color: #6B7280; margin: 0; }
`;

const PhoneMoodGrid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MoodEmoji = styled.div<{ active?: boolean }>`
  font-size: 24px;
  opacity: ${p => p.active ? 1 : 0.4};
  transform: ${p => p.active ? 'scale(1.2)' : 'scale(1)'};
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  span { font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; }
  color: #9CA3AF;
`;

const TrustSection = styled.div`
  padding: 40px 0;
  background: #F9FAFB;
  border-bottom: 1px solid #F3F4F6;
`;

const TrustGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const TrustItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #4B5563;
  font-size: 14px;
`;

const ScreenshotSection = styled.section`
  padding: 120px 0;
  overflow: hidden;
`;

const ScreenshotGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 80px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const ScreenshotImage = styled(motion.div)`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ScreenshotContent = styled(motion.div)``;

const SectionLabel = styled.div`
  color: #FF6A09;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 1px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 24px;
  line-height: 1.1;
`;

const SectionDescription = styled.p`
  font-size: 18px;
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  text-align: left;
`;

const FeatureListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 16px;
  
  svg { color: #16A34A; }
`;

const FeaturesSection = styled.section`
  padding: 120px 0;
  background: #FFFBF5;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 80px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid #F3F4F6;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.05);
  }
`;

const FeatureIcon = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${p => p.color}15;
  color: ${p => p.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const FeatureLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #FF6A09;
  text-decoration: none;
  
  &:hover { gap: 10px; }
  transition: all 0.2s;
`;

const StatsSection = styled.section`
  padding: 80px 0;
  background: #111827;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div``;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: #FF6A09;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #9CA3AF;
  font-weight: 500;
`;

const HowItWorksSection = styled.section`
  padding: 120px 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 80px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled(motion.div)`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 64px;
  height: 64px;
  background: #FF6A09;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 24px;
  position: relative;
  z-index: 2;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(255,106,9,0.3);
`;

const StepTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const StepDescription = styled.p`
  color: #6B7280;
  line-height: 1.6;
`;

const TestimonialsSection = styled.section`
  padding: 120px 0;
  background: #F3F4F6;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: white;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
`;

const TestimonialStars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
`;

const TestimonialText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
  font-style: italic;
  margin-bottom: 24px;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 700;
  color: #111827;
`;

const AuthorRole = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

const CTASection = styled.section`
  padding: 100px 0;
  background: white;
`;

const CTAContent = styled(motion.div)`
  background: linear-gradient(135deg, #111827, #1F2937);
  padding: 80px 40px;
  border-radius: 40px;
  text-align: center;
  color: white;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const CTATitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const CTADescription = styled.p`
  font-size: 20px;
  color: #9CA3AF;
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
  z-index: 1;
`;

// --- Data ---

const features = [
    {
        icon: ClipboardCheck,
        color: '#22C55E',
        title: 'Clinical Assessments',
        description: 'Take validated PHQ-9 and GAD-7 screenings to understand your mental health status.',
        link: '/assessments'
    },
    {
        icon: Video,
        color: '#06B6D4',
        title: 'Video Consultations',
        description: 'Connect with licensed counselors through secure, private video sessions.',
        link: '/video'
    },
    {
        icon: Heart,
        color: '#EC4899',
        title: 'Meditation Library',
        description: 'Access hundreds of guided meditations, sleep stories, and calming ambient sounds.',
        link: '/relax'
    },
    {
        icon: BookOpen,
        color: '#F59E0B',
        title: 'Self-Help Resources',
        description: 'Learn CBT techniques, coping strategies, and mindfulness practices.',
        link: '/learn'
    }
];

const testimonials = [
    {
        text: "MindMate helped me through one of the toughest semesters of my life. The AI chat was always there when I needed someone to talk to at 2 AM.",
        name: "Sarah K.",
        role: "Graduate Student",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    {
        text: "The mood tracking feature helped me identify patterns I never noticed before. I now understand my triggers and can manage them better.",
        name: "James M.",
        role: "Undergraduate",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
        text: "As someone with social anxiety, being able to chat with AI first gave me confidence to eventually speak with a real counselor.",
        name: "Priya R.",
        role: "PhD Candidate",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
];

const steps = [
    {
        number: 1,
        title: "Create Your Account",
        description: "Sign up in seconds with your email. Your data is encrypted and secure."
    },
    {
        number: 2,
        title: "Take an Assessment",
        description: "Complete our clinically validated screening to understand your current state."
    },
    {
        number: 3,
        title: "Start Your Journey",
        description: "Chat with AI, track your mood, meditate, or connect with professionals."
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HomePage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const screenshotRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

    const screenshotInView = useInView(screenshotRef, { once: true, margin: "-100px" });
    const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // GSAP scroll animations
        const ctx = gsap.context(() => {
            // Parallax hero visual
            gsap.to('.hero-visual', {
                y: 100,
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Feature cards stagger
            gsap.fromTo('.feature-card',
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.features-grid',
                        start: 'top 80%'
                    }
                }
            );

            // Stats counter animation
            gsap.fromTo('.stat-card',
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.15,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: '.stats-section',
                        start: 'top 80%'
                    }
                }
            );

            // Testimonials slide in
            gsap.fromTo('.testimonial-card',
                { opacity: 0, x: -40 },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.2,
                    duration: 0.7,
                    scrollTrigger: {
                        trigger: '.testimonials-grid',
                        start: 'top 80%'
                    }
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <HeroSection className="hero-section" ref={heroRef}>
                <Container>
                    <HeroGrid>
                        <HeroContent
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.div variants={itemVariants}>
                                <HeroBadge>
                                    <Sparkles size={16} />
                                    AI-Powered Mental Wellness
                                </HeroBadge>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <HeroTitle>
                                    Your <span>Mental Health</span> Journey Starts Here
                                </HeroTitle>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <HeroSubtitle>
                                    Get 24/7 AI support, track your mood, access guided meditations,
                                    and connect with licensed professionals—all in one place.
                                </HeroSubtitle>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <HeroCTAs>
                                    <Link href="/login">
                                        <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                                            Get Started Free
                                        </Button>
                                    </Link>
                                    <Link href="/video">
                                        <Button variant="secondary" size="lg">
                                            Watch Demo
                                        </Button>
                                    </Link>
                                </HeroCTAs>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <CrisisBox>
                                    <Phone size={20} color="#DC2626" />
                                    <span>In crisis? Call <strong>988</strong> or text <strong>HOME to 741741</strong></span>
                                </CrisisBox>
                            </motion.div>
                        </HeroContent>

                        <HeroVisual
                            className="hero-visual"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            {/* Decorative Circles */}
                            <DecorativeCircle
                                size={120}
                                color="linear-gradient(135deg, #FFD166, #FF9F1C)"
                                top="-20px"
                                right="40px"
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            />
                            <DecorativeCircle
                                size={80}
                                color="linear-gradient(135deg, #06B6D4, #3B82F6)"
                                bottom="80px"
                                left="-40px"
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            />
                            <DecorativeCircle
                                size={50}
                                color="linear-gradient(135deg, #EC4899, #F472B6)"
                                top="200px"
                                left="20px"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            />

                            {/* Floating Feature Cards */}
                            <FloatingCard
                                position="top-left"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                <FloatingCardIcon bg="linear-gradient(135deg, #3B82F6, #1D4ED8)">
                                    <MessageCircle size={22} />
                                </FloatingCardIcon>
                                <FloatingCardText>
                                    <h5>AI Counselor</h5>
                                    <p>24/7 support</p>
                                </FloatingCardText>
                            </FloatingCard>

                            <FloatingCard
                                position="bottom-right"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                            >
                                <FloatingCardIcon bg="linear-gradient(135deg, #22C55E, #16A34A)">
                                    <Activity size={22} />
                                </FloatingCardIcon>
                                <FloatingCardText>
                                    <h5>Mood Tracking</h5>
                                    <p>Daily insights</p>
                                </FloatingCardText>
                            </FloatingCard>

                            {/* Chat Bubble */}
                            <ChatBubble
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                What&apos;s on your mind?
                            </ChatBubble>

                            {/* Phone Mockup */}
                            <PhoneMockup
                                initial={{ y: 30 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                            >
                                <PhoneScreen>
                                    <PhoneStatusBar>9:41</PhoneStatusBar>
                                    <PhoneContent>
                                        <PhoneHeader>
                                            <h3>Good morning! 🌅</h3>
                                            <p>How are you feeling today?</p>
                                        </PhoneHeader>

                                        <PhoneCard>
                                            <PhoneMoodGrid>
                                                <MoodEmoji>😢</MoodEmoji>
                                                <MoodEmoji>😐</MoodEmoji>
                                                <MoodEmoji active>😊</MoodEmoji>
                                                <MoodEmoji>😄</MoodEmoji>
                                                <MoodEmoji>🥳</MoodEmoji>
                                            </PhoneMoodGrid>
                                        </PhoneCard>

                                        <PhoneCard>
                                            <h4>
                                                <Heart size={16} color="#EC4899" fill="#EC4899" />
                                                Today&apos;s Meditation
                                            </h4>
                                            <p>5-min breathing exercise for calm and clarity</p>
                                        </PhoneCard>

                                        <PhoneCard>
                                            <h4>
                                                <Brain size={16} color="#8B5CF6" />
                                                Quick Check-in
                                            </h4>
                                            <p>Take 2 min to reflect on your thoughts</p>
                                        </PhoneCard>
                                    </PhoneContent>
                                </PhoneScreen>
                            </PhoneMockup>
                        </HeroVisual>
                    </HeroGrid>
                </Container>

                <ScrollIndicator
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <span>Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <ChevronDown size={24} />
                    </motion.div>
                </ScrollIndicator>
            </HeroSection>

            {/* Trust Badges */}
            <TrustSection>
                <Container>
                    <TrustGrid>
                        {[
                            { icon: Lock, text: 'HIPAA Compliant' },
                            { icon: Shield, text: 'End-to-End Encrypted' },
                            { icon: Award, text: 'Evidence-Based' },
                            { icon: Zap, text: '24/7 AI Support' },
                            { icon: Users, text: '10K+ Users' }
                        ].map((item, i) => (
                            <TrustItem
                                key={item.text}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Check size={20} />
                                {item.text}
                            </TrustItem>
                        ))}
                    </TrustGrid>
                </Container>
            </TrustSection>

            {/* Screenshot Section 1 - AI Chat */}
            <ScreenshotSection ref={screenshotRef}>
                <Container>
                    <ScreenshotGrid>
                        <ScreenshotImage
                            initial={{ opacity: 0, x: -60 }}
                            animate={screenshotInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
                                alt="Woman using MindMate on laptop"
                            />
                        </ScreenshotImage>
                        <ScreenshotContent
                            initial={{ opacity: 0, x: 60 }}
                            animate={screenshotInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <SectionLabel>AI Counselor</SectionLabel>
                            <SectionTitle>Talk to Someone Who Understands</SectionTitle>
                            <SectionDescription>
                                Our AI counselor is trained on evidence-based therapeutic techniques
                                and is available 24/7. Share your thoughts in a judgment-free space.
                            </SectionDescription>
                            <FeatureList>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Cognitive Behavioral Therapy (CBT) techniques
                                </FeatureListItem>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Personalized responses based on your history
                                </FeatureListItem>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Crisis detection and professional escalation
                                </FeatureListItem>
                            </FeatureList>
                            <Link href="/chat">
                                <Button rightIcon={<ArrowRight size={18} />}>
                                    Start Chatting
                                </Button>
                            </Link>
                        </ScreenshotContent>
                    </ScreenshotGrid>
                </Container>
            </ScreenshotSection>

            {/* Screenshot Section 2 - Mood Tracking (reversed) */}
            <ScreenshotSection style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFBF7 100%)' }}>
                <Container>
                    <ScreenshotGrid style={{ direction: 'rtl' }}>
                        <ScreenshotImage
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ direction: 'ltr' }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop"
                                alt="Mood tracking dashboard"
                            />
                        </ScreenshotImage>
                        <ScreenshotContent
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ direction: 'ltr' }}
                        >
                            <SectionLabel>Mood Tracking</SectionLabel>
                            <SectionTitle>Understand Your Emotional Patterns</SectionTitle>
                            <SectionDescription>
                                Log your daily moods in seconds and discover insights about your
                                emotional well-being. Identify triggers and track your progress.
                            </SectionDescription>
                            <FeatureList>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Beautiful visualizations and weekly trends
                                </FeatureListItem>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Activity correlations and insights
                                </FeatureListItem>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Export data for your therapist
                                </FeatureListItem>
                            </FeatureList>
                            <Link href="/mood">
                                <Button rightIcon={<ArrowRight size={18} />}>
                                    Track Your Mood
                                </Button>
                            </Link>
                        </ScreenshotContent>
                    </ScreenshotGrid>
                </Container>
            </ScreenshotSection>

            {/* Screenshot Section 3 - Meditation */}
            <ScreenshotSection>
                <Container>
                    <ScreenshotGrid>
                        <ScreenshotImage
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop"
                                alt="Person meditating peacefully"
                            />
                        </ScreenshotImage>
                        <ScreenshotContent
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <SectionLabel>Meditation Library</SectionLabel>
                            <SectionTitle>Find Your Calm with Guided Sessions</SectionTitle>
                            <SectionDescription>
                                Access hundreds of guided meditations, sleep stories, and ambient
                                sounds. From 3-minute breathing exercises to deep sleep journeys.
                            </SectionDescription>
                            <FeatureList>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Sleep stories narrated by calming voices
                                </FeatureListItem>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Breathing exercises with visual guides
                                </FeatureListItem>
                                <FeatureListItem>
                                    <Check size={20} />
                                    Ambient sounds: rain, ocean, forest
                                </FeatureListItem>
                            </FeatureList>
                            <Link href="/relax">
                                <Button rightIcon={<ArrowRight size={18} />}>
                                    Explore Library
                                </Button>
                            </Link>
                        </ScreenshotContent>
                    </ScreenshotGrid>
                </Container>
            </ScreenshotSection>

            {/* Features Grid */}
            <FeaturesSection ref={featuresRef}>
                <Container>
                    <SectionHeader
                        initial={{ opacity: 0, y: 30 }}
                        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionLabel>Features</SectionLabel>
                        <SectionTitle>Everything You Need for Mental Wellness</SectionTitle>
                        <SectionDescription style={{ maxWidth: '600px', margin: '0 auto' }}>
                            A comprehensive toolkit designed to support every aspect of your mental health journey.
                        </SectionDescription>
                    </SectionHeader>

                    <FeaturesGrid className="features-grid">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} className="feature-card">
                                <FeatureIcon color={feature.color}>
                                    <feature.icon size={32} />
                                </FeatureIcon>
                                <FeatureTitle>{feature.title}</FeatureTitle>
                                <FeatureDescription>{feature.description}</FeatureDescription>
                                <FeatureLink href={feature.link}>
                                    Learn more <ArrowRight size={16} />
                                </FeatureLink>
                            </FeatureCard>
                        ))}
                    </FeaturesGrid>
                </Container>
            </FeaturesSection>

            {/* Stats Section */}
            <StatsSection className="stats-section">
                <Container>
                    <StatsGrid>
                        {[
                            { number: '10K+', label: 'Students Helped' },
                            { number: '500+', label: 'Counselor Sessions' },
                            { number: '50K+', label: 'Chat Messages' },
                            { number: '98%', label: 'Satisfaction Rate' }
                        ].map((stat) => (
                            <StatCard key={stat.label} className="stat-card">
                                <StatNumber>{stat.number}</StatNumber>
                                <StatLabel>{stat.label}</StatLabel>
                            </StatCard>
                        ))}
                    </StatsGrid>
                </Container>
            </StatsSection>

            {/* How It Works */}
            <HowItWorksSection>
                <Container>
                    <SectionHeader
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <SectionLabel>How It Works</SectionLabel>
                        <SectionTitle>Get Started in 3 Simple Steps</SectionTitle>
                    </SectionHeader>

                    <StepsGrid>
                        {steps.map((step, index) => (
                            <StepCard
                                key={step.number}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <StepNumber>{step.number}</StepNumber>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </StepCard>
                        ))}
                    </StepsGrid>
                </Container>
            </HowItWorksSection>

            {/* Testimonials */}
            <TestimonialsSection>
                <Container>
                    <SectionHeader
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <SectionLabel>Testimonials</SectionLabel>
                        <SectionTitle>Loved by Students Everywhere</SectionTitle>
                    </SectionHeader>

                    <TestimonialsGrid className="testimonials-grid">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.name} className="testimonial-card">
                                <TestimonialStars>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill="#F59E0B" />
                                    ))}
                                </TestimonialStars>
                                <TestimonialText>"{testimonial.text}"</TestimonialText>
                                <TestimonialAuthor>
                                    <AuthorAvatar src={testimonial.avatar} alt={testimonial.name} />
                                    <AuthorInfo>
                                        <AuthorName>{testimonial.name}</AuthorName>
                                        <AuthorRole>{testimonial.role}</AuthorRole>
                                    </AuthorInfo>
                                </TestimonialAuthor>
                            </TestimonialCard>
                        ))}
                    </TestimonialsGrid>
                </Container>
            </TestimonialsSection>

            {/* Final CTA */}
            <CTASection>
                <Container>
                    <CTAContent
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <SectionLabel>Ready to Start?</SectionLabel>
                        <CTATitle>Your Mental Wellness Journey Awaits</CTATitle>
                        <CTADescription>
                            Join thousands of students who have transformed their mental health with MindMate.
                            It's free to get started.
                        </CTADescription>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Link href="/login">
                                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="secondary" size="lg">
                                    Talk to Our Team
                                </Button>
                            </Link>
                        </div>
                    </CTAContent>
                </Container>
            </CTASection>
        </>
    );
}
