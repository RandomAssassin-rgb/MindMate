'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Clock, Star, Share2, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const articleData: Record<string, { title: string; category: string; categoryColor: string; time: string; date: string; image: string; content: string }> = {
  // ── Anxiety (3) ──
  'understanding-anxiety': {
    title: 'Understanding and Managing Anxiety',
    category: 'Anxiety', categoryColor: '#8B5CF6', time: '15 min read', date: 'Oct 12, 2024',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=600&fit=crop',
    content: `<h2>The Anatomy of Anxiety</h2><p>Anxiety is a natural response to stress, but when it becomes overwhelming or chronic, it can significantly impact quality of life. Understanding what happens in your brain and body during anxiety is the first step toward managing it.</p><h3>Physical Symptoms</h3><ul><li>Rapid heartbeat</li><li>Shallow breathing or shortness of breath</li><li>Muscle tension, especially in the neck and shoulders</li><li>Digestive issues</li></ul><h2>Evidence-Based Management Strategies</h2><p>While everyone's experience is different, these proven strategies can help build resilience and manage daily anxiety:</p><h3>1. Cognitive Reframing</h3><p>Notice when you're catastrophizing or engaging in "all or nothing" thinking. Pause and ask yourself: Is this thought based on facts or fear? What is a more realistic way to view this situation?</p><h3>2. Somatic Grounding</h3><p>The 5-4-3-2-1 technique is excellent for bringing you back to the present moment. Name 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.</p><div class="callout"><strong>Remember:</strong> You don't have to eliminate anxiety completely. The goal is to build a healthy relationship with it, where it informs you without controlling you.</div>`
  },
  'social-anxiety-toolkit': {
    title: 'A Practical Toolkit for Social Anxiety',
    category: 'Anxiety', categoryColor: '#8B5CF6', time: '10 min read', date: 'Nov 20, 2024',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop',
    content: `<h2>Why Social Situations Feel So Hard</h2><p>Social anxiety is more than shyness. It's an intense fear of being judged, embarrassed, or humiliated in social settings. The brain's amygdala fires a threat response, making social interactions feel genuinely dangerous, even when they're objectively safe.</p><h3>Before the Event: Prepare, Don't Rehearse</h3><p>Instead of scripting every possible conversation (which increases pressure), prepare 2-3 open-ended topics you feel comfortable discussing. This gives you a safety net without the rigidity of a script.</p><h2>During the Event: The DARE Method</h2><ul><li><strong>D</strong>efuse — "So what if I blush or stumble?"</li><li><strong>A</strong>llow — Let the anxiety be present without fighting it</li><li><strong>R</strong>un toward — Engage more, don't retreat</li><li><strong>E</strong>ngage — Shift focus outward to the other person</li></ul><h2>After the Event: Resist the Post-Mortem</h2><p>The urge to replay every moment and judge yourself is strong. Set a 5-minute timer for reflection, then consciously move on to another activity.</p>`
  },
  'panic-attack-first-aid': {
    title: 'Panic Attack First Aid: What to Do in the Moment',
    category: 'Anxiety', categoryColor: '#8B5CF6', time: '7 min read', date: 'Jan 15, 2025',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
    content: `<h2>Understanding What's Happening</h2><p>A panic attack is your body's fight-or-flight system misfiring. It is not dangerous, even though it feels terrifying. Your heart races, you may feel dizzy, and your chest tightens — but these are all temporary physiological responses.</p><h3>Step 1: Ground Your Feet</h3><p>Press your feet firmly into the floor. Feel the solid ground beneath you. This sends a signal to your nervous system that you are safe and stable.</p><h3>Step 2: Breathe with the 4-7-8 Pattern</h3><p>Inhale for 4 seconds. Hold for 7 seconds. Exhale slowly for 8 seconds. This activates the parasympathetic nervous system, directly counteracting the panic response.</p><h3>Step 3: Use Cold Water</h3><p>Splash cold water on your wrists or hold an ice cube. The cold sensation triggers the "dive reflex," which slows your heart rate significantly.</p><div class="callout"><strong>Key Reminder:</strong> A panic attack typically peaks within 10 minutes. It will pass. Remind yourself: "I am safe. This is temporary."</div>`
  },
  // ── Depression (2) ──
  'recognizing-depression': {
    title: 'Recognizing the Signs of Depression',
    category: 'Depression', categoryColor: '#EC4899', time: '12 min read', date: 'Oct 28, 2024',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&h=600&fit=crop',
    content: `<h2>More Than Just Feeling Sad</h2><p>Depression is a clinical condition, not a character flaw. It affects how you think, feel, and function daily. Recognizing the signs early is crucial for seeking appropriate support.</p><h3>Common But Often Overlooked Signs</h3><ul><li>Persistent feelings of emptiness or numbness (not just sadness)</li><li>Loss of interest in activities you once enjoyed</li><li>Changes in appetite or weight</li><li>Difficulty concentrating or making decisions</li><li>Physical aches and pains with no clear medical cause</li></ul><h2>The Importance of Professional Help</h2><p>If you've experienced several of these symptoms for more than two weeks, consider speaking to a healthcare professional. Depression is highly treatable with therapy, medication, or a combination of both.</p><div class="callout"><strong>You are not alone.</strong> Depression affects over 280 million people worldwide. Seeking help is a sign of strength, not weakness.</div>`
  },
  'building-daily-structure': {
    title: 'Building Daily Structure When Everything Feels Heavy',
    category: 'Depression', categoryColor: '#EC4899', time: '9 min read', date: 'Feb 10, 2025',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=600&fit=crop',
    content: `<h2>Why Routine Helps Depression</h2><p>When depression strips away motivation, routine provides external scaffolding for your day. It removes the exhausting burden of decision-making and gives you small, achievable wins to build momentum.</p><h3>The "Minimum Viable Day"</h3><p>On your hardest days, don't aim for productivity. Aim for a Minimum Viable Day:</p><ul><li>Get out of bed (even if you return later)</li><li>Drink a glass of water</li><li>Step outside for 2 minutes</li><li>Eat one meal</li></ul><h2>Behavioral Activation</h2><p>This CBT technique involves scheduling small pleasant activities, even when you don't feel like doing them. The key insight is that action often precedes motivation, not the other way around. Start with 5-minute activities and build from there.</p>`
  },
  // ── Sleep (2) ──
  'better-sleep-guide': {
    title: 'Better Sleep Guide',
    category: 'Sleep', categoryColor: '#3B82F6', time: '12 min read', date: 'Nov 04, 2024',
    image: 'https://images.unsplash.com/photo-1512101176959-c557f3516787?w=1200&h=600&fit=crop',
    content: `<h2>Why Sleep Hygiene Matters</h2><p>Quality sleep is fundamental to mental health. Without it, emotional regulation becomes incredibly difficult, and stress perception is magnified.</p><h3>The 3-2-1 Rule Before Bed</h3><ul><li><strong>3 hours before bed:</strong> Stop eating heavy meals and drinking alcohol.</li><li><strong>2 hours before bed:</strong> Stop working and engaging in highly stimulating activities.</li><li><strong>1 hour before bed:</strong> Turn off screens and start your wind-down routine.</li></ul><h2>Optimizing Your Environment</h2><p>Your bedroom should be treated as a sanctuary exclusively for sleep and intimacy. Keep the room cool (around 65°F/18°C), ensure complete darkness using blackout curtains or an eye mask, and consider white noise if you live in a noisy environment.</p>`
  },
  'racing-thoughts-at-night': {
    title: 'How to Quiet Racing Thoughts at Night',
    category: 'Sleep', categoryColor: '#3B82F6', time: '8 min read', date: 'Feb 01, 2025',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=600&fit=crop',
    content: `<h2>Why Your Brain Won't Shut Off</h2><p>During the day, your brain is occupied with external stimuli. At night, with fewer distractions, unresolved worries and thoughts rush in. This is a normal neurological process, but it can be managed.</p><h3>The Brain Dump Technique</h3><p>Keep a notepad by your bed. Before turning off the lights, spend 5 minutes writing down every single thought, worry, or task in your mind. This externalizes the information and signals to your brain that it's "saved" somewhere safe.</p><h2>Cognitive Shuffling</h2><p>Pick a random word (e.g., "GARDEN"). For each letter, visualize a vivid, unrelated image: G = gorilla, A = apple, R = rocket. This occupies the verbal-thinking part of your brain with meaningless imagery, mimicking the random associations that occur naturally during sleep onset.</p>`
  },
  // ── Stress (3) ──
  'student-stress-management': {
    title: 'Stress Management for Students',
    category: 'Stress', categoryColor: '#F59E0B', time: '8 min read', date: 'Jan 05, 2025',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
    content: `<h2>The Student Pressure Cooker</h2><p>Academic pressure mixed with social dynamics and future uncertainty creates a unique crucible of stress for students. It's vital to develop tools to navigate this without burning out.</p><h3>Time Blocking vs. To-Do Lists</h3><p>Long to-do lists actually increase cortisol (the stress hormone). Instead, try time blocking. Assign specific tasks to specific blocks of time in your calendar. When the block is over, move on.</p><h2>The 80/20 Rule in Academics</h2><p>The Pareto Principle states that 80% of results come from 20% of efforts. Applying this to studying means recognizing that perfectionism is often procrastination in disguise. Aim for comprehensive understanding, not flawless memorization of trivial details.</p><div class="callout"><strong>Self-Compassion Break:</strong> Speak to yourself the way you would speak to a friend who is struggling with the same academic workload.</div>`
  },
  'workplace-burnout': {
    title: 'Recognizing & Recovering from Workplace Burnout',
    category: 'Stress', categoryColor: '#F59E0B', time: '11 min read', date: 'Dec 05, 2024',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
    content: `<h2>Burnout Is Not Just Being Tired</h2><p>The WHO defines burnout as a syndrome resulting from chronic workplace stress that has not been successfully managed. It has three dimensions: exhaustion, cynicism, and reduced professional efficacy.</p><h3>The Three Warning Signs</h3><ul><li><strong>Exhaustion:</strong> You feel drained before the workday even begins.</li><li><strong>Cynicism:</strong> You've become detached, negative, or apathetic about work you once cared about.</li><li><strong>Inefficacy:</strong> You feel like nothing you do makes a difference.</li></ul><h2>Recovery Strategies</h2><p>Recovery requires boundary-setting. Start by establishing one hard boundary this week: no emails after 7 PM, a 30-minute lunchbreak away from your desk, or delegating one task you've been holding onto.</p>`
  },
  'healthy-boundaries': {
    title: 'Setting Healthy Boundaries Without Guilt',
    category: 'Stress', categoryColor: '#F59E0B', time: '10 min read', date: 'Mar 01, 2025',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1200&h=600&fit=crop',
    content: `<h2>Why Boundaries Are Hard</h2><p>Many of us were taught that saying "no" is selfish. In reality, boundaries are essential for mental health. Without them, resentment builds, energy depletes, and relationships suffer.</p><h3>The Boundary Formula</h3><p>Use this structure: "I care about [relationship], and I need [specific boundary] because [reason]." For example: "I care about our friendship, and I need you to text before visiting because I need some afternoons for rest."</p><h2>Guilt Is Normal — But Not a Guide</h2><p>Feeling guilty after setting a boundary doesn't mean you did the wrong thing. Guilt is often a sign that you're breaking an old pattern. Sit with it. It will pass. The relief that follows is your confirmation.</p><div class="callout"><strong>Remember:</strong> You are not responsible for how others react to your boundaries. You ARE responsible for communicating them kindly and clearly.</div>`
  },
  // ── Self-Care (2) ──
  'digital-detox': {
    title: 'The Digital Detox: Reclaiming Your Attention',
    category: 'Self-Care', categoryColor: '#22C55E', time: '9 min read', date: 'Nov 12, 2024',
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1200&h=600&fit=crop',
    content: `<h2>Your Brain on Infinite Scroll</h2><p>Social media platforms are engineered to exploit dopamine loops in your brain. Every notification, like, and new post triggers a small reward. Over time, this erodes your ability to focus on tasks that provide slower, deeper satisfaction.</p><h3>Start a "Low-Information Diet"</h3><ul><li>Unfollow accounts that make you feel inadequate</li><li>Set screen time limits for social apps (start with 30 min/day)</li><li>Turn off all non-essential notifications</li><li>Designate phone-free zones (bedroom, dining table)</li></ul><h2>The Replacement Principle</h2><p>Simply removing your phone creates a void. Fill it intentionally: keep a physical book by the couch, buy a puzzle, or start a sketchbook. Your brain needs an alternative source of engagement.</p>`
  },
  'self-compassion-practice': {
    title: 'Self-Compassion: The Skill You Were Never Taught',
    category: 'Self-Care', categoryColor: '#22C55E', time: '10 min read', date: 'Feb 20, 2025',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=600&fit=crop',
    content: `<h2>Self-Criticism vs. Self-Compassion</h2><p>Research by Dr. Kristin Neff shows that people who practice self-compassion are more motivated, not less. Self-criticism activates the brain's threat system (cortisol, adrenaline), while self-compassion activates the care system (oxytocin, endorphins).</p><h3>The Three Components</h3><ul><li><strong>Self-kindness:</strong> Treat yourself with the same warmth you'd offer a close friend.</li><li><strong>Common humanity:</strong> Recognize that suffering and imperfection are part of the shared human experience.</li><li><strong>Mindfulness:</strong> Observe your pain without over-identifying with it.</li></ul><h2>A Daily Practice</h2><p>When you notice self-critical thoughts, place your hand on your heart and say: "This is a moment of suffering. Suffering is a part of life. May I be kind to myself." This simple practice, repeated consistently, rewires neural pathways over time.</p>`
  },
  // ── Mindfulness (3) ──
  'intro-to-mindfulness': {
    title: 'Introduction to Mindfulness',
    category: 'Mindfulness', categoryColor: '#06B6D4', time: '10 min read', date: 'Dec 18, 2024',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop',
    content: `<h2>What Actually is Mindfulness?</h2><p>Mindfulness isn't about clearing your mind of all thoughts—that's a common misconception that often sets people up for failure. It's simply the practice of paying attention to the present moment intentionally, and without judgment.</p><h3>Starting Small</h3><p>You don't need to sit cross-legged on a cushion for 45 minutes. Try incorporating mindfulness into everyday activities:</p><ul><li><strong>Mindful Eating:</strong> Pay attention to the texture, taste, and temperature of the first three bites of your meal.</li><li><strong>Mindful Walking:</strong> Notice the sensation of your feet hitting the ground and the air on your skin on your commute.</li></ul><h2>The "Weather Report" Check-in</h2><p>Once a day, pause and ask yourself: "What is my internal weather right now?" Is it stormy? Overcast? Sunny and clear? Just observe it without trying to change the weather.</p>`
  },
  'body-scan-meditation': {
    title: 'Body Scan Meditation: A Complete Guide',
    category: 'Mindfulness', categoryColor: '#06B6D4', time: '8 min read', date: 'Jan 25, 2025',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&h=600&fit=crop',
    content: `<h2>What Is a Body Scan?</h2><p>A body scan is a meditation technique where you systematically focus attention on different parts of your body, from your toes to the top of your head. It builds interoception — your ability to sense internal bodily signals — which is closely linked to emotional awareness.</p><h3>How to Practice (10 minutes)</h3><ul><li>Lie down comfortably and close your eyes.</li><li>Start at your toes. Notice any sensations: warmth, tingling, tension, or nothing at all.</li><li>Slowly move your attention upward: feet, ankles, calves, knees, thighs, hips.</li><li>Continue through your abdomen, chest, hands, arms, shoulders, neck, and head.</li><li>If your mind wanders, gently guide it back to the last body part you remember.</li></ul><h2>Why It Works</h2><p>Many people carry emotions as physical tension without realizing it. The body scan helps you identify where you "store" stress. Over time, simply noticing the tension is often enough to release it.</p>`
  },
  'mindful-journaling': {
    title: 'Mindful Journaling: Writing Your Way to Clarity',
    category: 'Mindfulness', categoryColor: '#06B6D4', time: '7 min read', date: 'Mar 10, 2025',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&h=600&fit=crop',
    content: `<h2>Beyond Dear Diary</h2><p>Mindful journaling isn't about recording events. It's about exploring your inner landscape with curiosity. Research from the University of Texas shows that expressive writing can improve immune function, reduce anxiety, and clarify thinking.</p><h3>Three Prompts to Start</h3><ul><li><strong>Right now, I am feeling…</strong> (describe the feeling without judging it)</li><li><strong>Something I noticed today that I usually ignore…</strong></li><li><strong>If I were giving myself advice as a friend, I would say…</strong></li></ul><h2>The 10-Minute Rule</h2><p>Set a timer for 10 minutes and write without stopping. Don't edit, don't censor, don't worry about grammar. The goal is to externalize your internal monologue. When the timer ends, you can choose to read it, or simply close the notebook. Both are valid.</p>`
  }
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: white;
`;

const ArticleHeader = styled.header<{ bgImage: string }>`
  height: 60vh;
  min-height: 400px;
  position: relative;
  background: url(${({ bgImage }) => bgImage}) center/cover;
  display: flex;
  align-items: flex-end;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  width: 100%;
  margin: 0 auto;
  padding: 60px ${({ theme }) => theme.spacing.lg};
  color: white;
`;

const CategoryTag = styled.div<{ color: string }>`
  display: inline-block;
  background: ${({ color }) => color};
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.1;
  margin-bottom: 24px;
  max-width: 800px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;
  opacity: 0.9;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: -40px auto 100px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
`;

const ArticleCard = styled.article`
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }

  h2 {
    font-size: 28px;
    margin: 40px 0 20px;
    color: ${({ theme }) => theme.colors.text};
  }
  
  h3 {
    font-size: 22px;
    margin: 32px 0 16px;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    font-size: 18px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 24px;
  }
  
  ul {
    margin-bottom: 24px;
    padding-left: 24px;
    
    li {
      font-size: 18px;
      line-height: 1.7;
      color: ${({ theme }) => theme.colors.textSecondary};
      margin-bottom: 12px;
    }
  }

  .callout {
    background: #F8FAFC;
    border-left: 4px solid #3B82F6;
    padding: 24px;
    border-radius: 0 12px 12px 0;
    margin: 40px 0;
    font-size: 18px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TopNav = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  z-index: 10;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  padding: 10px 20px;
  border-radius: 100px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const FeedbackSection = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const FeedbackLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
`;

const FeedbackButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const FeedbackBtn = styled.button<{ selected?: boolean; variant: 'yes' | 'no' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid ${props => props.selected ? (props.variant === 'yes' ? '#22C55E' : '#EF4444') : '#E2E8F0'};
  border-radius: 100px;
  background: ${props => props.selected ? (props.variant === 'yes' ? '#F0FDF4' : '#FEF2F2') : 'white'};
  color: ${props => props.selected ? (props.variant === 'yes' ? '#16A34A' : '#DC2626') : '#475569'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.variant === 'yes' ? '#22C55E' : '#EF4444'};
  }
`;

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articleData[params.slug as keyof typeof articleData];
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  if (!article) {
    notFound();
  }

  return (
    <PageWrapper>
      <ArticleHeader bgImage={article.image}>
        <TopNav>
          <Link href="/learn">
            <NavButton>
              <ArrowLeft size={18} />
              Back to Library
            </NavButton>
          </Link>
          <ActionButtons>
            <NavButton><Bookmark size={18} /></NavButton>
            <NavButton><Share2 size={18} /></NavButton>
          </ActionButtons>
        </TopNav>
        
        <HeaderContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CategoryTag color={article.categoryColor}>
              {article.category}
            </CategoryTag>
          </motion.div>
          
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {article.title}
          </Title>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Meta>
              <span><Clock size={16} /> {article.time}</span>
              <span>•</span>
              <span>{article.date}</span>
            </Meta>
          </motion.div>
        </HeaderContent>
      </ArticleHeader>

      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ArticleCard dangerouslySetInnerHTML={{ __html: article.content }} />
          
          <FeedbackSection>
            <FeedbackLabel>Was this article helpful?</FeedbackLabel>
            <FeedbackButtons>
              <FeedbackBtn 
                variant="yes" 
                selected={feedback === 'yes'} 
                onClick={() => setFeedback('yes')}
              >
                <ThumbsUp size={18} /> Yes
              </FeedbackBtn>
              <FeedbackBtn 
                variant="no" 
                selected={feedback === 'no'} 
                onClick={() => setFeedback('no')}
              >
                <ThumbsDown size={18} /> No
              </FeedbackBtn>
            </FeedbackButtons>
          </FeedbackSection>
          
          {feedback && (
            <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748B', fontSize: '14px' }}>
              Thank you for your feedback!
            </p>
          )}
        </motion.div>
      </ContentContainer>
    </PageWrapper>
  );
}
