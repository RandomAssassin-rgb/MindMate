'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BookOpen, Clock, Star, ArrowRight, Brain, Moon, Zap, Shield, Heart, Wind, Coffee, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #FEF3E8 0%, #FFFBF7 100%);
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(180deg, #F3E8FF 0%, #E9D5FF 40%, #FEF3E8 100%);
  position: relative;
  overflow: hidden;
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1920&h=800&fit=crop') center/cover;
  opacity: 0.1;
  z-index: 0;
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const PageIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.3);
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(36px, 5vw, 52px);
  margin-bottom: 16px;
  
  span {
    background: linear-gradient(135deg, #8B5CF6, #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto 40px;
`;

const QuickTechSection = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
`;

const SectionIcon = styled.div<{ color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ color }) => color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`;

const SectionTitle = styled.h2`
  font-size: 32px;
`;

const TechniquesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const TechniqueCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
    border-color: #8B5CF640;
  }
`;

const TechniqueEmoji = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const TechniqueTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
`;

const TechniqueDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 16px;
`;

const TechniqueMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const GuidesSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(180deg, #FFFBF7 0%, #F0F9FF 100%);
`;

const GuidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 28px;
`;

const GuideCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  }
`;

const GuideImage = styled.div<{ image: string }>`
  height: 200px;
  background: url(${({ image }) => image}) center/cover;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4));
  }
`;

const GuideCategory = styled.span<{ color: string }>`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 14px;
  background: ${({ color }) => color};
  color: white;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
`;

const GuideContent = styled.div`
  padding: 24px;
`;

const GuideTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 10px;
`;

const GuideDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 18px;
`;

const GuideMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GuideStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .stars {
    color: #F59E0B;
  }
`;

const GuideLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  
  svg {
    transition: transform 0.2s;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const TopicsSection = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
`;

const TopicCard = styled(motion.div) <{ color: string }>`
  background: white;
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ color }) => color};
    background: ${({ color }) => color}08;
    transform: translateY(-4px);
  }
`;

const TopicIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ color }) => color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  margin: 0 auto 16px;
`;

const TopicTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 4px;
`;

const TopicCount = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const techniques = [
  {
    emoji: '🌬️',
    title: '4-7-8 Breathing',
    description: 'A calming breathing technique that helps reduce anxiety and promote relaxation.',
    time: '3 min',
    rating: 4.9
  },
  {
    emoji: '🎯',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your five senses to ground yourself in the present moment.',
    time: '5 min',
    rating: 4.8
  },
  {
    emoji: '💪',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups to relieve physical tension.',
    time: '10 min',
    rating: 4.7
  },
  {
    emoji: '🧊',
    title: 'Cold Water Reset',
    description: 'A quick technique using cold water to calm your nervous system.',
    time: '2 min',
    rating: 4.6
  }
];

const guides = [
  {
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=700&h=400&fit=crop',
    category: 'Anxiety',
    categoryColor: '#8B5CF6',
    title: 'Understanding and Managing Anxiety',
    description: 'Learn about the causes of anxiety and evidence-based strategies to manage it effectively.',
    time: '15 min read',
    rating: 4.9
  },
  {
    image: 'https://images.unsplash.com/photo-1512101176959-c557f3516787?w=700&h=400&fit=crop',
    category: 'Sleep',
    categoryColor: '#3B82F6',
    title: 'Better Sleep Guide',
    description: 'Improve your sleep quality with science-backed tips and relaxation techniques.',
    time: '12 min read',
    rating: 4.8
  },
  {
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=400&fit=crop',
    category: 'Mindfulness',
    categoryColor: '#22C55E',
    title: 'Introduction to Mindfulness',
    description: 'Discover how mindfulness can transform your mental well-being and daily life.',
    time: '10 min read',
    rating: 4.9
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=400&fit=crop',
    category: 'Stress',
    categoryColor: '#F59E0B',
    title: 'Stress Management for Students',
    description: 'Practical strategies to balance academic pressure and maintain well-being.',
    time: '8 min read',
    rating: 4.7
  }
];

const topics = [
  { title: 'Anxiety', count: 12, icon: Brain, color: '#8B5CF6' },
  { title: 'Depression', count: 8, icon: Heart, color: '#EC4899' },
  { title: 'Sleep', count: 10, icon: Moon, color: '#3B82F6' },
  { title: 'Stress', count: 15, icon: Zap, color: '#F59E0B' },
  { title: 'Self-Care', count: 9, icon: Shield, color: '#22C55E' },
  { title: 'Mindfulness', count: 7, icon: Wind, color: '#06B6D4' }
];

export default function LearnPage() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, delay: 0.2 }
      );
    }
  }, []);

  return (
    <PageWrapper>
      <HeroSection>
        <HeroImage />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageIcon>
              <BookOpen size={36} color="white" />
            </PageIcon>
          </motion.div>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn & <span>Grow</span>
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Evidence-based articles, guides, and techniques to support your mental wellness journey
          </HeroSubtitle>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" rightIcon={<Sparkles size={18} />}>
              Explore Resources
            </Button>
          </motion.div>
        </Container>
      </HeroSection>

      <QuickTechSection>
        <Container>
          <SectionHeader>
            <SectionIcon color="#8B5CF6">
              <Zap size={26} />
            </SectionIcon>
            <SectionTitle>Quick Techniques</SectionTitle>
          </SectionHeader>

          <TechniquesGrid ref={cardsRef}>
            {techniques.map((tech, index) => (
              <TechniqueCard
                key={tech.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TechniqueEmoji>{tech.emoji}</TechniqueEmoji>
                <TechniqueTitle>{tech.title}</TechniqueTitle>
                <TechniqueDesc>{tech.description}</TechniqueDesc>
                <TechniqueMeta>
                  <span><Clock size={14} /> {tech.time}</span>
                  <span><Star size={14} fill="#F59E0B" color="#F59E0B" /> {tech.rating}</span>
                </TechniqueMeta>
              </TechniqueCard>
            ))}
          </TechniquesGrid>
        </Container>
      </QuickTechSection>

      <GuidesSection>
        <Container>
          <SectionHeader>
            <SectionIcon color="#EC4899">
              <BookOpen size={26} />
            </SectionIcon>
            <SectionTitle>In-Depth Guides</SectionTitle>
          </SectionHeader>

          <GuidesGrid>
            {guides.map((guide, index) => (
              <GuideCard
                key={guide.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GuideImage image={guide.image}>
                  <GuideCategory color={guide.categoryColor}>
                    {guide.category}
                  </GuideCategory>
                </GuideImage>
                <GuideContent>
                  <GuideTitle>{guide.title}</GuideTitle>
                  <GuideDesc>{guide.description}</GuideDesc>
                  <GuideMeta>
                    <GuideStats>
                      <span><Clock size={14} /> {guide.time}</span>
                      <span className="stars">
                        <Star size={14} fill="#F59E0B" /> {guide.rating}
                      </span>
                    </GuideStats>
                    <GuideLink href="#">
                      Read <ArrowRight size={16} />
                    </GuideLink>
                  </GuideMeta>
                </GuideContent>
              </GuideCard>
            ))}
          </GuidesGrid>
        </Container>
      </GuidesSection>

      <TopicsSection>
        <Container>
          <SectionHeader>
            <SectionIcon color="#22C55E">
              <Brain size={26} />
            </SectionIcon>
            <SectionTitle>Browse by Topic</SectionTitle>
          </SectionHeader>

          <TopicsGrid>
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.title}
                color={topic.color}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <TopicIcon color={topic.color}>
                  <topic.icon size={28} />
                </TopicIcon>
                <TopicTitle>{topic.title}</TopicTitle>
                <TopicCount>{topic.count} articles</TopicCount>
              </TopicCard>
            ))}
          </TopicsGrid>
        </Container>
      </TopicsSection>
    </PageWrapper>
  );
}
