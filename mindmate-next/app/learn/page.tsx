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
  { slug: 'understanding-anxiety', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=700&h=400&fit=crop', category: 'Anxiety', categoryColor: '#8B5CF6', title: 'Understanding and Managing Anxiety', description: 'Learn about the causes of anxiety and evidence-based strategies to manage it effectively.', time: '15 min read', rating: 4.9 },
  { slug: 'social-anxiety-toolkit', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=400&fit=crop', category: 'Anxiety', categoryColor: '#8B5CF6', title: 'A Practical Toolkit for Social Anxiety', description: 'Prepare, engage, and recover from social situations with these evidence-based techniques.', time: '10 min read', rating: 4.8 },
  { slug: 'panic-attack-first-aid', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&h=400&fit=crop', category: 'Anxiety', categoryColor: '#8B5CF6', title: 'Panic Attack First Aid', description: 'Grounding, breathing, and cold-water techniques to manage a panic attack in real-time.', time: '7 min read', rating: 4.9 },
  { slug: 'recognizing-depression', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=700&h=400&fit=crop', category: 'Depression', categoryColor: '#EC4899', title: 'Recognizing the Signs of Depression', description: 'Learn the often-overlooked signs of depression and when to seek professional help.', time: '12 min read', rating: 4.8 },
  { slug: 'building-daily-structure', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=700&h=400&fit=crop', category: 'Depression', categoryColor: '#EC4899', title: 'Building Daily Structure When Everything Feels Heavy', description: 'Behavioral activation techniques and the Minimum Viable Day framework.', time: '9 min read', rating: 4.7 },
  { slug: 'better-sleep-guide', image: 'https://images.unsplash.com/photo-1512101176959-c557f3516787?w=700&h=400&fit=crop', category: 'Sleep', categoryColor: '#3B82F6', title: 'Better Sleep Guide', description: 'Improve your sleep quality with science-backed tips and relaxation techniques.', time: '12 min read', rating: 4.8 },
  { slug: 'racing-thoughts-at-night', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&h=400&fit=crop', category: 'Sleep', categoryColor: '#3B82F6', title: 'How to Quiet Racing Thoughts at Night', description: 'Brain dump techniques and cognitive shuffling to calm your mind before sleep.', time: '8 min read', rating: 4.7 },
  { slug: 'student-stress-management', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=400&fit=crop', category: 'Stress', categoryColor: '#F59E0B', title: 'Stress Management for Students', description: 'Practical strategies to balance academic pressure and maintain well-being.', time: '8 min read', rating: 4.7 },
  { slug: 'workplace-burnout', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&h=400&fit=crop', category: 'Stress', categoryColor: '#F59E0B', title: 'Recognizing & Recovering from Workplace Burnout', description: 'Identify the three dimensions of burnout and begin a structured recovery.', time: '11 min read', rating: 4.8 },
  { slug: 'healthy-boundaries', image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=700&h=400&fit=crop', category: 'Stress', categoryColor: '#F59E0B', title: 'Setting Healthy Boundaries Without Guilt', description: 'A practical formula for communicating boundaries kindly and clearly.', time: '10 min read', rating: 4.9 },
  { slug: 'digital-detox', image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=700&h=400&fit=crop', category: 'Self-Care', categoryColor: '#22C55E', title: 'The Digital Detox: Reclaiming Your Attention', description: 'Break the infinite scroll cycle and reclaim your focus with intentional habits.', time: '9 min read', rating: 4.6 },
  { slug: 'self-compassion-practice', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=700&h=400&fit=crop', category: 'Self-Care', categoryColor: '#22C55E', title: 'Self-Compassion: The Skill You Were Never Taught', description: 'Learn the three-component model backed by Dr. Kristin Neff\'s research.', time: '10 min read', rating: 4.9 },
  { slug: 'intro-to-mindfulness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=400&fit=crop', category: 'Mindfulness', categoryColor: '#06B6D4', title: 'Introduction to Mindfulness', description: 'Discover how mindfulness can transform your mental well-being and daily life.', time: '10 min read', rating: 4.9 },
  { slug: 'body-scan-meditation', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=700&h=400&fit=crop', category: 'Mindfulness', categoryColor: '#06B6D4', title: 'Body Scan Meditation: A Complete Guide', description: 'A step-by-step guide to building body awareness and releasing stored tension.', time: '8 min read', rating: 4.8 },
  { slug: 'mindful-journaling', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&h=400&fit=crop', category: 'Mindfulness', categoryColor: '#06B6D4', title: 'Mindful Journaling: Writing Your Way to Clarity', description: 'Expressive writing prompts and techniques to externalize your inner monologue.', time: '7 min read', rating: 4.7 },
];

const topics = [
  { title: 'Anxiety', count: 3, icon: Brain, color: '#8B5CF6' },
  { title: 'Depression', count: 2, icon: Heart, color: '#EC4899' },
  { title: 'Sleep', count: 2, icon: Moon, color: '#3B82F6' },
  { title: 'Stress', count: 3, icon: Zap, color: '#F59E0B' },
  { title: 'Self-Care', count: 2, icon: Shield, color: '#22C55E' },
  { title: 'Mindfulness', count: 3, icon: Wind, color: '#06B6D4' }
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
                    <GuideLink href={`/learn/${guide.slug}`}>
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
              >
                <TopicIcon color={topic.color}>
                  <topic.icon size={28} />
                </TopicIcon>
                <TopicTitle>{topic.title}</TopicTitle>
                <TopicCount>{topic.count} articles</TopicCount>
              </TopicCard>
            ))}
          </TopicsGrid>

          {/* CBT Tool CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: 48, textAlign: 'center' }}
          >
            <Link href="/learn/cbt">
              <Button size="lg" rightIcon={<Brain size={18} />}>
                Try the CBT Thought Record Tool
              </Button>
            </Link>
          </motion.div>
        </Container>
      </TopicsSection>
    </PageWrapper>
  );
}
