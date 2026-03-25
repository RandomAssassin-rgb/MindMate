'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Brain, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #0F172A;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  color: #64748B;
  font-size: 16px;
  line-height: 1.6;
`;

const StepWrapper = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  height: 6px;
  flex: 1;
  border-radius: 4px;
  background: ${props => 
    props.active ? '#3B82F6' : 
    props.completed ? '#93C5FD' : '#E2E8F0'};
  transition: all 0.3s ease;
`;

const Question = styled.h2`
  font-size: 24px;
  color: #0F172A;
  margin-bottom: 8px;
`;

const HelperText = styled.p`
  color: #64748B;
  font-size: 15px;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 16px;
  color: #1E293B;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 16px;
  color: #1E293B;
  transition: all 0.2s;
  margin-bottom: 24px;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SliderWrapper = styled.div`
  margin: 32px 0;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 500;
  color: #0F172A;
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  background: #E2E8F0;
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    border: 4px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`;

const ReflectionCard = styled(motion.div)`
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 20px;
  padding: 32px;
  margin-top: 32px;
  display: flex;
  gap: 20px;
`;

const Disclaimer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 12px;
  margin-top: 32px;
  font-size: 14px;
  color: #92400E;
`;

type CBTEntry = {
  situation: string;
  automaticThought: string;
  emotion: string;
  intensity: number;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
};

const steps = [
  { id: 'situation', title: 'The Situation', helper: 'Describe the event objectively. Who, what, where, when?' },
  { id: 'thought', title: 'Automatic Thought', helper: 'What exactly went through your mind in that moment?' },
  { id: 'emotion', title: 'Emotion & Intensity', helper: 'Name the specific feeling (e.g., Anxious, Sad, Angry) and rate its strength.' },
  { id: 'evidence', title: 'The Evidence', helper: 'What are the facts that support and contradict this thought?' },
  { id: 'balanced', title: 'Balanced Perspective', helper: 'Given all the evidence, what is a more realistic or helpful way to look at this?' }
];

export default function CBTJournal() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reflection, setReflection] = useState('');
  const [entry, setEntry] = useState<CBTEntry>({
    situation: '',
    automaticThought: '',
    emotion: '',
    intensity: 50,
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: ''
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitJournal();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return entry.situation.trim().length > 5;
      case 1: return entry.automaticThought.trim().length > 5;
      case 2: return entry.emotion.trim().length > 2;
      case 3: return entry.evidenceFor.trim().length > 5 || entry.evidenceAgainst.trim().length > 5;
      case 4: return entry.balancedThought.trim().length > 5;
      default: return false;
    }
  };

  const submitJournal = async () => {
    setIsSubmitting(true);
    try {
      // 1. Get user
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. Format Request
      const bodyPayload = {
        situation: entry.situation,
        automaticThought: entry.automaticThought,
        emotion: entry.emotion,
        intensity: entry.intensity,
        evidenceFor: entry.evidenceFor,
        evidenceAgainst: entry.evidenceAgainst,
        balancedThought: entry.balancedThought
      };

      // 3. Get AI Reflection
      const aiResponse = await fetch('/api/cbt-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      const aiData = await aiResponse.json();
      const reflectionText = aiData.reflection || 'Thank you for tracking your thoughts.';

      // 4. Save to Database
      if (session) {
        await supabase.from('journal_entries').insert({
          user_id: session.user.id,
          situation: entry.situation,
          automatic_thought: entry.automaticThought,
          emotion: entry.emotion,
          intensity: entry.intensity,
          evidence_for: entry.evidenceFor,
          evidence_against: entry.evidenceAgainst,
          balanced_thought: entry.balancedThought,
          ai_reflection: reflectionText
        });
      }

      setReflection(reflectionText);
      setCurrentStep(steps.length); // Move to completion screen

    } catch (err: any) {
      alert('Error saving journal: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Button variant="ghost" onClick={() => router.push('/learn')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={18} /> Back to Library
          </Button>
          <Title>
            <Brain size={32} color="#3B82F6" />
            CBT Thought Record
          </Title>
          <Subtitle>
            A structured cognitive behavioral therapy exercise to help you pause, unpack, and reframe negative thoughts.
          </Subtitle>
        </Header>

        {currentStep < steps.length ? (
          <StepWrapper
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProgressBar>
              {steps.map((step, idx) => (
                <ProgressStep 
                  key={step.id} 
                  active={idx === currentStep} 
                  completed={idx < currentStep} 
                />
              ))}
            </ProgressBar>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Question>{steps[currentStep].title}</Question>
                <HelperText>{steps[currentStep].helper}</HelperText>

                {currentStep === 0 && (
                  <TextArea
                    placeholder="E.g., I presented my project in the meeting, and my boss asked a lot of questions."
                    value={entry.situation}
                    onChange={(e) => setEntry({ ...entry, situation: e.target.value })}
                  />
                )}

                {currentStep === 1 && (
                  <TextArea
                    placeholder="E.g., My boss thinks my work is terrible. I am going to get fired."
                    value={entry.automaticThought}
                    onChange={(e) => setEntry({ ...entry, automaticThought: e.target.value })}
                  />
                )}

                {currentStep === 2 && (
                  <div>
                    <Input
                      placeholder="Name the emotion (e.g., Anxious, Sad, Ashamed)"
                      value={entry.emotion}
                      onChange={(e) => setEntry({ ...entry, emotion: e.target.value })}
                    />
                    <SliderWrapper>
                      <SliderHeader>
                        <span>How strong is this feeling?</span>
                        <span>{entry.intensity}%</span>
                      </SliderHeader>
                      <RangeInput
                        type="range"
                        min="0"
                        max="100"
                        value={entry.intensity}
                        onChange={(e) => setEntry({ ...entry, intensity: parseInt(e.target.value) })}
                      />
                    </SliderWrapper>
                  </div>
                )}

                {currentStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Evidence FOR the thought:</h4>
                      <TextArea
                        style={{ minHeight: '100px' }}
                        placeholder="E.g., My boss did ask questions about a flaw in my slide."
                        value={entry.evidenceFor}
                        onChange={(e) => setEntry({ ...entry, evidenceFor: e.target.value })}
                      />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Evidence AGAINST the thought:</h4>
                      <TextArea
                        style={{ minHeight: '100px' }}
                        placeholder="E.g., He also praised my initiative. He asks everyone tough questions."
                        value={entry.evidenceAgainst}
                        onChange={(e) => setEntry({ ...entry, evidenceAgainst: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <TextArea
                    placeholder="E.g., My boss notices details and wanted clarity, but this doesn't mean my overall work is bad. I am still a valued employee."
                    value={entry.balancedThought}
                    onChange={(e) => setEntry({ ...entry, balancedThought: e.target.value })}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <NavButtons>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Reflection' : 'Next Step'}
              </Button>
            </NavButtons>
          </StepWrapper>
        ) : (
          <StepWrapper
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Check size={32} color="#16A34A" />
              </div>
              <Question>Journal Saved</Question>
              <p style={{ color: '#64748B', maxWidth: 400, margin: '0 auto' }}>
                You've successfully challenged your automatic thought and found a more balanced perspective. Great work.
              </p>
            </div>

            {reflection && (
              <ReflectionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={24} color="#16A34A" style={{ flexShrink: 0, marginTop: 4 }} />
                <div>
                  <h3 style={{ margin: '0 0 8px', color: '#166534', fontSize: '16px' }}>MindMate's Reflection</h3>
                  <p style={{ margin: 0, color: '#14532D', lineHeight: 1.6, fontSize: '15px' }}>
                    {reflection}
                  </p>
                </div>
              </ReflectionCard>
            )}

            <Disclaimer>
              <AlertCircle size={20} />
              <div>
                <strong>Privacy Note:</strong> This exercise was saved to your private journal history. The AI reflection uses your input securely and does not claim to offer medical diagnosing.
              </div>
            </Disclaimer>

            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <Button onClick={() => router.push('/learn')}>Return to Library</Button>
            </div>
          </StepWrapper>
        )}
      </Container>
    </PageWrapper>
  );
}
