'use client';

import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

const HeroSection = styled.section`
  min-height: calc(100vh - 72px);
  padding: 120px 32px 80px;
  background: linear-gradient(180deg, #FFF7F2 0%, #FFEEE4 50%, #FFF7F2 100%);
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 100px 20px 60px;
    min-height: auto;
  }
`;

const HeroContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  @media (max-width: 1024px) {
    order: 2;
  }
`;

const HeroTagline = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255,106,9,0.1);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: #FF6A09;
  margin-bottom: 24px;
  
  svg {
    animation: sparkle 2s ease-in-out infinite;
  }
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.15;
  color: #111827;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  
  span {
    background: linear-gradient(135deg, #FF6A09, #FFD36A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 18px;
  line-height: 1.7;
  color: #6B6F76;
  max-width: 480px;
  margin-bottom: 36px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
    margin: 0 auto 36px;
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    
    button, a {
      width: 100%;
    }
  }
`;

const SecondaryLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 999px;
  transition: all 180ms;
  
  &:hover {
    background: rgba(17,24,39,0.06);
    color: #111827;
    
    svg {
      transform: translateX(4px);
    }
  }
  
  svg {
    transition: transform 180ms;
  }
`;

const HeroIllustration = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 1024px) {
    order: 1;
  }
`;

const LottieWrapper = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  position: relative;
  
  @media (max-width: 1024px) {
    max-width: 400px;
    margin: 0 auto;
  }
`;

const FloatingBadge = styled(motion.div) <{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }>`
  position: absolute;
  ${({ position }) => {
        switch (position) {
            case 'top-left': return 'top: 10%; left: -5%;';
            case 'top-right': return 'top: 15%; right: -8%;';
            case 'bottom-left': return 'bottom: 20%; left: -10%;';
            case 'bottom-right': return 'bottom: 10%; right: -5%;';
        }
    }}
  background: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(17,24,39,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const BadgeIcon = styled.span<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

// Simple meditation animation as placeholder (Lottie JSON would be loaded)
const meditationLottieUrl = 'https://lottie.host/embed/8c5c8d8b-c3e1-4d84-a3a5-6c27e1a867c1/2yZ3dSXX2t.json';

export function Hero() {
    const reducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -8, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    };

    return (
        <HeroSection>
            <HeroContainer>
                <HeroContent
                    as={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <HeroTagline variants={itemVariants}>
                        <Sparkles size={16} />
                        Your Mental Wellness Companion
                    </HeroTagline>

                    <HeroTitle variants={itemVariants}>
                        Find peace of mind with <span>MindMate</span>
                    </HeroTitle>

                    <HeroSubtitle variants={itemVariants}>
                        Guided meditations, AI-powered support, mood tracking, and professional
                        counseling — all in one beautiful app designed for your well-being.
                    </HeroSubtitle>

                    <HeroActions variants={itemVariants}>
                        <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                            Start Free
                        </Button>
                        <SecondaryLink href="/learn">
                            Explore Features
                            <ArrowRight size={16} />
                        </SecondaryLink>
                    </HeroActions>
                </HeroContent>

                <HeroIllustration>
                    <LottieWrapper
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
                    >
                        {/* Lottie meditation animation */}
                        <Player
                            autoplay={!reducedMotion}
                            loop
                            src={meditationLottieUrl}
                            style={{ width: '100%', height: 'auto' }}
                        />

                        {/* Floating badges */}
                        {!reducedMotion && (
                            <>
                                <FloatingBadge
                                    position="top-left"
                                    variants={floatVariants}
                                    animate="animate"
                                >
                                    <BadgeIcon color="#DCFCE7">🧘</BadgeIcon>
                                    Meditation
                                </FloatingBadge>

                                <FloatingBadge
                                    position="top-right"
                                    variants={floatVariants}
                                    animate="animate"
                                    transition={{ delay: 0.5 }}
                                >
                                    <BadgeIcon color="#DBEAFE">💬</BadgeIcon>
                                    AI Chat
                                </FloatingBadge>

                                <FloatingBadge
                                    position="bottom-right"
                                    variants={floatVariants}
                                    animate="animate"
                                    transition={{ delay: 1 }}
                                >
                                    <BadgeIcon color="#FEF3C7">📊</BadgeIcon>
                                    Mood Track
                                </FloatingBadge>
                            </>
                        )}
                    </LottieWrapper>
                </HeroIllustration>
            </HeroContainer>
        </HeroSection>
    );
}

export default Hero;
