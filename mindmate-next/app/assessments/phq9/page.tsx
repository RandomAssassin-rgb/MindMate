'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
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

const QuizWrapper = styled(motion.div)`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #F1F5F9;
  border-radius: 4px;
  margin-bottom: 32px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #3B82F6;
  border-radius: 4px;
`;

const Question = styled.h2`
  font-size: 24px;
  color: #0F172A;
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.4;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionButton = styled(motion.button)<{ selected: boolean }>`
  width: 100%;
  padding: 16px 24px;
  border: 2px solid ${props => props.selected ? '#3B82F6' : '#E2E8F0'};
  border-radius: 12px;
  background: ${props => props.selected ? '#EFF6FF' : 'white'};
  text-align: left;
  font-size: 16px;
  color: #1E293B;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    border-color: #3B82F6;
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const ResultCard = styled(motion.div)<{ severity: string }>`
  background: white;
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border-top: 8px solid ${props => 
    props.severity === 'minimal' ? '#22C55E' :
    props.severity === 'mild' ? '#F59E0B' :
    props.severity === 'moderate' ? '#EF4444' : '#DC2626'};
`;

const ScoreCircle = styled.div<{ severity: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => 
    props.severity === 'minimal' ? '#DCFCE7' :
    props.severity === 'mild' ? '#FEF3C7' :
    props.severity === 'moderate' ? '#FEE2E2' : '#FEE2E2'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

const ScoreNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #0F172A;
`;

const ScoreLabel = styled.div`
  font-size: 14px;
  color: #64748B;
`;

const ResultTitle = styled.h2`
  font-size: 24px;
  color: #0F172A;
  margin-bottom: 12px;
`;

const ResultDesc = styled.p`
  color: #475569;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const Disclaimer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: 12px;
  font-size: 14px;
  color: #92400E;
  text-align: left;
  margin-bottom: 32px;
  
  svg {
    flex-shrink: 0;
    color: #F59E0B;
    margin-top: 2px;
  }
`;

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 }
];

export default function PHQ9Assessment() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = async () => {
    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate and save to database
      setIsSaving(true);
      const totalScore = answers.reduce((sum, a) => sum + (a || 0), 0);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await supabase.from('assessments').insert({
          user_id: session.user.id,
          type: 'PHQ-9',
          score: totalScore
        });
      }
      
      setIsSaving(false);
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const totalScore = answers.reduce((sum, a) => sum + (a || 0), 0);
  let severity = 'minimal';
  if (totalScore >= 5 && totalScore <= 9) severity = 'mild';
  if (totalScore >= 10 && totalScore <= 14) severity = 'moderate';
  if (totalScore >= 15) severity = 'severe';

  return (
    <PageWrapper>
      <Container>
        <Button variant="ghost" onClick={() => router.push('/assessments')} style={{ marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Button>

        {showResults ? (
          <ResultCard 
            severity={severity}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ScoreCircle severity={severity}>
              <ScoreNumber>{totalScore}</ScoreNumber>
              <ScoreLabel>out of 27</ScoreLabel>
            </ScoreCircle>
            
            <ResultTitle>
              {severity === 'minimal' && 'Minimal Depression'}
              {severity === 'mild' && 'Mild Depression'}
              {severity === 'moderate' && 'Moderate Depression'}
              {severity === 'severe' && 'Severe Depression'}
            </ResultTitle>
            
            <ResultDesc>
              {severity === 'minimal' && 'Your responses suggest minimal symptoms. Continue self-care practices and track your mood regularly.'}
              {severity === 'mild' && 'Your responses suggest mild symptoms. Consider exploring our CBT journaling tools or talking to a counselor.'}
              {severity === 'moderate' && 'Your responses suggest moderate symptoms. Professional support is recommended to help you manage these feelings.'}
              {severity === 'severe' && 'Your responses suggest severe symptoms. Please seek professional help. If you are in crisis, contact emergency services (988).'}
            </ResultDesc>

            <Disclaimer>
              <AlertCircle size={20} />
              <span>This is a screening tool, not a diagnosis. Please consult a mental health professional for proper evaluation and treatment.</span>
            </Disclaimer>

            <Button onClick={() => router.push('/assessments')} style={{ width: '100%' }}>
              Return to Dashboard
            </Button>
          </ResultCard>
        ) : (
          <QuizWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProgressBar>
              <ProgressFill
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestion + 1) / phq9Questions.length * 100}%` }}
              />
            </ProgressBar>

            <div style={{ textAlign: 'center', marginBottom: '16px', color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>
              Question {currentQuestion + 1} of {phq9Questions.length}
            </div>

            <Question>
              Over the last 2 weeks, how often have you been bothered by:
              <br /><br />
              <span style={{ color: '#3B82F6' }}>"{phq9Questions[currentQuestion]}"</span>
            </Question>

            <OptionsGrid>
              {options.map(option => (
                <OptionButton
                  key={option.value}
                  selected={answers[currentQuestion] === option.value}
                  onClick={() => handleAnswer(option.value)}
                >
                  {option.label}
                  {answers[currentQuestion] === option.value && <Check size={20} color="#3B82F6" />}
                </OptionButton>
              ))}
            </OptionsGrid>

            <NavButtons>
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined || isSaving}
              >
                {isSaving ? 'Saving...' : currentQuestion === phq9Questions.length - 1 ? 'See Results' : 'Next'}
              </Button>
            </NavButtons>
          </QuizWrapper>
        )}
      </Container>
    </PageWrapper>
  );
}
