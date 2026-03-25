'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ClipboardList, Activity, ChevronRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #0F172A;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748B;
  font-size: 16px;
  max-width: 600px;
  line-height: 1.5;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #3B82F6;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: #EFF6FF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #0F172A;
  margin: 0 0 4px 0;
`;

const CardDesc = styled.p`
  color: #64748B;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`;

const HistorySection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #E2E8F0;
`;

const HistoryTitle = styled.h2`
  font-size: 20px;
  color: #0F172A;
  margin-bottom: 24px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
`;

const HistoryMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HistoryType = styled.span`
  font-weight: 600;
  color: #0F172A;
`;

const HistoryDate = styled.span`
  font-size: 13px;
  color: #64748B;
`;

const HistoryScore = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ScoreBadge = styled.span<{ score: number, type: string }>`
  background: ${props => {
    // Basic severity colors
    const max = props.type === 'PHQ-9' ? 27 : 21;
    const ratio = props.score / max;
    if (ratio < 0.2) return '#D1FAE5'; // minimal
    if (ratio < 0.4) return '#FEF3C7'; // mild
    if (ratio < 0.6) return '#FFEDD5'; // moderate
    return '#FEE2E2'; // severe
  }};
  color: ${props => {
    const max = props.type === 'PHQ-9' ? 27 : 21;
    const ratio = props.score / max;
    if (ratio < 0.2) return '#065F46';
    if (ratio < 0.4) return '#92400E';
    if (ratio < 0.6) return '#9A3412';
    return '#991B1B';
  }};
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748B;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px dashed #CBD5E1;
`;

const DisclaimerBanner = styled.div`
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 32px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  p {
    margin: 0;
    font-size: 14px;
    color: #991B1B;
    line-height: 1.5;
  }
`;

export default function AssessmentsDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (data) setHistory(data);
      setLoading(false);
    };

    fetchHistory();
  }, [router]);

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <Title>Clinical Assessments</Title>
          <Subtitle>
            Validated screening tools to help you understand your emotional well-being over time.
          </Subtitle>
        </PageHeader>

        <DisclaimerBanner>
          <Info size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p>
            <strong>Not a Diagnosis.</strong> These assessments are standard screening tools but do not replace a professional medical evaluation. If your scores are consistently high or you are in distress, please seek professional help or contact emergency lines (988).
          </p>
        </DisclaimerBanner>

        <CardsGrid>
          <AssessmentCard 
            onClick={() => router.push('/assessments/phq9')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardHeader>
              <IconWrapper>
                <ClipboardList size={24} color="#3B82F6" />
              </IconWrapper>
              <ChevronRight color="#CBD5E1" />
            </CardHeader>
            <CardTitle>PHQ-9 (Depression)</CardTitle>
            <CardDesc>A 9-question tool to measure the severity of depression over the last 2 weeks.</CardDesc>
          </AssessmentCard>

          <AssessmentCard 
            onClick={() => router.push('/assessments/gad7')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader>
              <IconWrapper>
                <Activity size={24} color="#3B82F6" />
              </IconWrapper>
              <ChevronRight color="#CBD5E1" />
            </CardHeader>
            <CardTitle>GAD-7 (Anxiety)</CardTitle>
            <CardDesc>A 7-question tool to measure the severity of generalized anxiety disorder over the last 2 weeks.</CardDesc>
          </AssessmentCard>
        </CardsGrid>

        <HistorySection>
          <HistoryTitle>Your Assessment History</HistoryTitle>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading...</div>
          ) : history.length === 0 ? (
            <EmptyState>
              You haven't completed any assessments yet. Select one above to get started.
            </EmptyState>
          ) : (
            <HistoryList>
              {history.map((record) => (
                <HistoryItem key={record.id}>
                  <HistoryMeta>
                    <HistoryType>{record.type}</HistoryType>
                    <HistoryDate>
                      {new Date(record.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </HistoryDate>
                  </HistoryMeta>
                  <HistoryScore>
                    <span style={{ color: '#64748B', fontSize: '14px' }}>Score:</span>
                    <ScoreBadge score={record.score} type={record.type}>
                      {record.score}
                    </ScoreBadge>
                  </HistoryScore>
                </HistoryItem>
              ))}
            </HistoryList>
          )}
        </HistorySection>
      </Container>
    </PageWrapper>
  );
}
