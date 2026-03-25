'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, CheckCircle, XCircle, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748B;
  margin-top: 4px;
`;

const ReportCard = styled.div<{ status: string }>`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  opacity: ${p => p.status === 'pending' ? 1 : 0.6};
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ReasonTag = styled.span`
  background: #FEF2F2;
  color: #EF4444;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const StatusTag = styled.span<{ type: string }>`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${p => p.type === 'pending' ? '#F59E0B' : p.type === 'resolved' ? '#10B981' : '#64748B'};
`;

const PostPreview = styled.div`
  background: #F8FAFC;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  margin-bottom: 16px;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

type Report = {
  id: string;
  reason: string;
  post_id: string;
  status: string;
  created_at: string;
  post_body: string;
  is_hidden: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      
      // Basic admin check for demo (email contains admin)
      if (!user.email?.includes('admin')) {
        alert('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      fetchReports();
    };
    checkAdmin();
  }, [router]);

  async function fetchReports() {
    setLoading(true);
    // Join with posts to see what was reported
    const { data, error } = await supabase
      .from('forum_reports')
      .select(`
        *,
        forum_posts!inner (body, is_hidden)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map((r: any) => ({
        ...r,
        post_body: r.forum_posts.body,
        is_hidden: r.forum_posts.is_hidden
      }));
      setReports(formatted);
    }
    setLoading(false);
  }

  async function handleAction(reportId: string, postId: string, action: 'hide' | 'ignore') {
    if (action === 'hide') {
      await supabase.from('forum_posts').update({ is_hidden: true }).eq('id', postId);
      await supabase.from('forum_reports').update({ status: 'resolved' }).eq('id', reportId);
    } else {
      await supabase.from('forum_reports').update({ status: 'ignored' }).eq('id', reportId);
    }
    fetchReports();
  }

  if (loading && !isAdmin) return <PageWrapper><Loader2 className="animate-spin mx-auto" /></PageWrapper>;

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title><Shield color="#8B5CF6" /> Moderation Dashboard</Title>
          <Button variant="outline" size="sm" onClick={fetchReports}>Refresh</Button>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatValue>{reports.filter(r => r.status === 'pending').length}</StatValue>
            <StatLabel>Pending Reports</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.length}</StatValue>
            <StatLabel>Total Reports (90d)</StatLabel>
          </StatCard>
        </StatsGrid>

        <div>
          {reports.map(report => (
            <ReportCard key={report.id} status={report.status}>
              <ReportHeader>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ReasonTag>{report.reason}</ReasonTag>
                  <StatusTag type={report.status}>{report.status}</StatusTag>
                </div>
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                  {new Date(report.created_at).toLocaleString()}
                </div>
              </ReportHeader>

              <PostPreview>
                {report.post_body}
                {report.is_hidden && (
                  <div style={{ marginTop: '8px', color: '#EF4444', fontWeight: 600, fontSize: '12px' }}>
                    [Currently Hidden]
                  </div>
                )}
              </PostPreview>

              {report.status === 'pending' && (
                <Actions>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => handleAction(report.id, report.post_id, 'hide')}
                    leftIcon={<EyeOff size={14} />}
                  >
                    Hide Post
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleAction(report.id, report.post_id, 'ignore')}
                    leftIcon={<XCircle size={14} />}
                  >
                    Ignore
                  </Button>
                </Actions>
              )}
            </ReportCard>
          ))}

          {reports.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '64px', color: '#64748B' }}>
              <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <h3>All clear!</h3>
              <p>No community reports found.</p>
            </div>
          )}
        </div>
      </Container>
    </PageWrapper>
  );
}
