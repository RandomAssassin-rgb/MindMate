'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, ChevronRight, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
`;

const AssessmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AssessmentCard = styled(Card) <{ color: string }>`
  border-left: 4px solid ${({ color }) => color};
  cursor: pointer;
  
  &:hover {
    border-color: ${({ color }) => color};
  }
`;

const AssessmentIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ color }) => color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  svg {
    color: ${({ color }) => color};
  }
`;

const AssessmentMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const QuizWrapper = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div) <{ progress: number }>`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
`;

const Question = styled.h2`
  font-size: ${({ theme }) => theme.typography.h3};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OptionButton = styled(motion.button) <{ selected: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ selected, theme }) => selected ? theme.colors.primaryLight : theme.colors.surface};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.body};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.fast};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ResultCard = styled(Card) <{ severity: string }>`
  text-align: center;
  border-top: 4px solid ${({ severity }) =>
        severity === 'minimal' ? '#22C55E' :
            severity === 'mild' ? '#F59E0B' :
                severity === 'moderate' ? '#EF4444' : '#DC2626'};
`;

const ScoreCircle = styled.div<{ severity: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ severity }) =>
        severity === 'minimal' ? '#DCFCE7' :
            severity === 'mild' ? '#FEF3C7' :
                severity === 'moderate' ? '#FEE2E2' : '#FEE2E2'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const ScoreNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.muted};
`;

const Disclaimer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  svg {
    flex-shrink: 0;
    color: #F59E0B;
  }
`;

const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself",
    "Trouble concentrating on things",
    "Moving or speaking slowly, or being fidgety/restless",
    "Thoughts that you would be better off dead"
];

const options = [
    { label: 'Not at all', value: 0 },
    { label: 'Several days', value: 1 },
    { label: 'More than half the days', value: 2 },
    { label: 'Nearly every day', value: 3 }
];

export default function AssessmentsPage() {
    const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (value: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = value;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestion < phq9Questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const resetAssessment = () => {
        setActiveAssessment(null);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResults(false);
    };

    const totalScore = answers.reduce((sum, a) => sum + (a || 0), 0);
    const severity =
        totalScore <= 4 ? 'minimal' :
            totalScore <= 9 ? 'mild' :
                totalScore <= 14 ? 'moderate' : 'severe';

    if (activeAssessment === 'phq9') {
        return (
            <PageWrapper>
                <Container>
                    <Button variant="ghost" onClick={resetAssessment} style={{ marginBottom: '24px' }}>
                        <ArrowLeft size={18} /> Back to Assessments
                    </Button>

                    {showResults ? (
                        <ResultCard severity={severity} padding="lg">
                            <ScoreCircle severity={severity}>
                                <ScoreNumber>{totalScore}</ScoreNumber>
                                <ScoreLabel>out of 27</ScoreLabel>
                            </ScoreCircle>
                            <CardTitle style={{ marginBottom: '8px' }}>
                                {severity === 'minimal' && 'Minimal Depression'}
                                {severity === 'mild' && 'Mild Depression'}
                                {severity === 'moderate' && 'Moderate Depression'}
                                {severity === 'severe' && 'Severe Depression'}
                            </CardTitle>
                            <CardDescription>
                                {severity === 'minimal' && 'Your responses suggest minimal symptoms. Continue self-care practices.'}
                                {severity === 'mild' && 'Your responses suggest mild symptoms. Consider talking to someone.'}
                                {severity === 'moderate' && 'Your responses suggest moderate symptoms. Professional support is recommended.'}
                                {severity === 'severe' && 'Your responses suggest severe symptoms. Please seek professional help.'}
                            </CardDescription>

                            <Button onClick={resetAssessment} style={{ marginTop: '24px' }}>
                                Take Another Assessment
                            </Button>

                            <Disclaimer>
                                <AlertCircle size={18} />
                                <span>
                                    This is a screening tool, not a diagnosis. Please consult a mental health
                                    professional for proper evaluation and treatment.
                                </span>
                            </Disclaimer>
                        </ResultCard>
                    ) : (
                        <QuizWrapper>
                            <ProgressBar>
                                <ProgressFill
                                    progress={(currentQuestion + 1) / phq9Questions.length * 100}
                                    animate={{ width: `${(currentQuestion + 1) / phq9Questions.length * 100}%` }}
                                />
                            </ProgressBar>

                            <div style={{ textAlign: 'center', marginBottom: '16px', color: '#9CA3AF' }}>
                                Question {currentQuestion + 1} of {phq9Questions.length}
                            </div>

                            <Question>
                                Over the last 2 weeks, how often have you been bothered by:
                                <br />
                                <span style={{ color: '#FF6A00' }}>{phq9Questions[currentQuestion]}</span>
                            </Question>

                            <OptionsGrid>
                                {options.map(option => (
                                    <OptionButton
                                        key={option.value}
                                        selected={answers[currentQuestion] === option.value}
                                        onClick={() => handleAnswer(option.value)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {option.label}
                                        {answers[currentQuestion] === option.value && <Check size={20} />}
                                    </OptionButton>
                                ))}
                            </OptionsGrid>

                            <NavButtons>
                                <Button
                                    variant="ghost"
                                    onClick={prevQuestion}
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={nextQuestion}
                                    disabled={answers[currentQuestion] === undefined}
                                >
                                    {currentQuestion === phq9Questions.length - 1 ? 'See Results' : 'Next'}
                                    <ChevronRight size={18} />
                                </Button>
                            </NavButtons>
                        </QuizWrapper>
                    )}
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <PageHeader>
                    <PageTitle>Mental Health Assessments</PageTitle>
                    <PageSubtitle>
                        Clinically validated screening tools to help you understand your mental health
                    </PageSubtitle>
                </PageHeader>

                <AssessmentGrid>
                    <AssessmentCard
                        color="#8B5CF6"
                        padding="lg"
                        onClick={() => setActiveAssessment('phq9')}
                    >
                        <AssessmentIcon color="#8B5CF6">
                            <ClipboardCheck size={24} />
                        </AssessmentIcon>
                        <CardTitle>PHQ-9</CardTitle>
                        <CardDescription>
                            Patient Health Questionnaire for depression screening.
                            9 questions, takes about 3 minutes.
                        </CardDescription>
                        <AssessmentMeta>
                            <span>9 questions</span>
                            <span>~3 min</span>
                        </AssessmentMeta>
                    </AssessmentCard>

                    <AssessmentCard
                        color="#3B82F6"
                        padding="lg"
                        onClick={() => setActiveAssessment('gad7')}
                    >
                        <AssessmentIcon color="#3B82F6">
                            <ClipboardCheck size={24} />
                        </AssessmentIcon>
                        <CardTitle>GAD-7</CardTitle>
                        <CardDescription>
                            Generalized Anxiety Disorder assessment.
                            7 questions, takes about 2 minutes.
                        </CardDescription>
                        <AssessmentMeta>
                            <span>7 questions</span>
                            <span>~2 min</span>
                        </AssessmentMeta>
                    </AssessmentCard>
                </AssessmentGrid>

                <Disclaimer>
                    <AlertCircle size={18} />
                    <span>
                        These assessments are screening tools only and do not provide a diagnosis.
                        Results should be discussed with a qualified mental health professional.
                    </span>
                </Disclaimer>
            </Container>
        </PageWrapper>
    );
}
