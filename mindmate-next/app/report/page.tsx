'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { FileText, Download, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #EFF6FF, #F0FDF4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #0F172A;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  color: #64748B;
  font-size: 16px;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 32px 0;
`;

const StatBox = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px 12px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #3B82F6;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748B;
`;

const Disclaimer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 32px;
  font-size: 14px;
  color: #92400E;
  
  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

type MoodEntry = { created_at: string; mood_score: number; mood_label: string; note?: string };
type Assessment = { created_at: string; type: string; score: number };
type JournalEntry = { created_at: string; situation: string; automatic_thought: string; emotion: string; intensity: number; balanced_thought: string };

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const since = ninetyDaysAgo.toISOString();

      const [moodRes, assessRes, journalRes] = await Promise.all([
        supabase.from('mood_entries').select('*').eq('user_id', session.user.id).gte('created_at', since).order('created_at', { ascending: true }),
        supabase.from('assessments').select('*').eq('user_id', session.user.id).gte('created_at', since).order('created_at', { ascending: false }),
        supabase.from('journal_entries').select('*').eq('user_id', session.user.id).gte('created_at', since).order('created_at', { ascending: false }),
      ]);

      setMoods(moodRes.data || []);
      setAssessments(assessRes.data || []);
      setJournals(journalRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [router]);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const purple = [139, 92, 246] as [number, number, number];
      const dark = [15, 23, 42] as [number, number, number];
      const muted = [100, 116, 139] as [number, number, number];

      // ── Header ──
      doc.setFillColor(...purple);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('MindMate — Wellness Report', 20, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}   |   Last 90 Days`, 20, 30);

      // ── Medical Disclaimer ──
      doc.setTextColor(...muted);
      doc.setFontSize(8);
      doc.text(
        'DISCLAIMER: This report is a personal wellness summary tool. It is NOT a medical record or clinical diagnosis. Consult a licensed mental health professional for medical advice.',
        20, 48, { maxWidth: 170 }
      );

      let y = 62;

      // ── Summary Stats ──
      doc.setTextColor(...dark);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', 20, y);
      y += 8;

      const avgMood = moods.length > 0 ? (moods.reduce((s, m) => s + m.mood_score, 0) / moods.length).toFixed(1) : 'N/A';
      const lastPHQ = assessments.find(a => a.type === 'PHQ-9');
      const lastGAD = assessments.find(a => a.type === 'GAD-7');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...muted);
      doc.text([
        `Mood Logs: ${moods.length}   |   Avg Mood Score: ${avgMood}/10`,
        `Assessments Taken: ${assessments.length}   |   CBT Journals: ${journals.length}`,
        `Latest PHQ-9: ${lastPHQ ? `${lastPHQ.score}/27` : 'Not taken'}   |   Latest GAD-7: ${lastGAD ? `${lastGAD.score}/21` : 'Not taken'}`,
      ], 20, y);
      y += 24;

      // ── Mood History ──
      if (moods.length > 0) {
        doc.setTextColor(...dark);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Mood Log', 20, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [['Date', 'Score', 'Label', 'Note']],
          body: moods.slice(-20).map(m => [
            new Date(m.created_at).toLocaleDateString(),
            `${m.mood_score}/10`,
            m.mood_label || '—',
            (m.note || '').substring(0, 60) + (m.note && m.note.length > 60 ? '…' : ''),
          ]),
          headStyles: { fillColor: purple },
          styles: { fontSize: 9 },
          columnStyles: { 3: { cellWidth: 80 } },
        });
        y = (doc as any).lastAutoTable.finalY + 12;
      }

      // ── Assessment History ──
      if (assessments.length > 0) {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setTextColor(...dark);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Clinical Assessments', 20, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [['Date', 'Assessment', 'Score', 'Interpretation']],
          body: assessments.map(a => {
            let interp = 'Minimal';
            if (a.type === 'PHQ-9') {
              if (a.score >= 15) interp = 'Severe';
              else if (a.score >= 10) interp = 'Moderate';
              else if (a.score >= 5) interp = 'Mild';
            } else {
              if (a.score >= 15) interp = 'Severe';
              else if (a.score >= 10) interp = 'Moderate';
              else if (a.score >= 5) interp = 'Mild';
            }
            return [new Date(a.created_at).toLocaleDateString(), a.type, `${a.score}`, interp];
          }),
          headStyles: { fillColor: [236, 72, 153] },
          styles: { fontSize: 9 },
        });
        y = (doc as any).lastAutoTable.finalY + 12;
      }

      // ── CBT Journal Summary ──
      if (journals.length > 0) {
        if (y > 220) { doc.addPage(); y = 20; }
        doc.setTextColor(...dark);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CBT Journal Entries', 20, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [['Date', 'Emotion', 'Intensity', 'Situation (Summary)']],
          body: journals.slice(0, 15).map(j => [
            new Date(j.created_at).toLocaleDateString(),
            j.emotion,
            `${j.intensity}%`,
            j.situation.substring(0, 50) + (j.situation.length > 50 ? '…' : ''),
          ]),
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 9 },
        });
      }

      // ── Footer on all pages ──
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...muted);
        doc.text('MindMate — Private & Confidential. Not for clinical use.', 20, 290);
        doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
      }

      doc.save(`MindMate_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err: any) {
      alert('Error generating PDF: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <Card initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ color: '#64748B' }}>Loading your data…</div>
          </Card>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IconWrapper>
            <FileText size={36} color="#3B82F6" />
          </IconWrapper>
          <Title>My Wellness Report</Title>
          <Subtitle>
            Generate a private PDF summary of your last 90 days — mood trends, assessment scores, and CBT journal entries — ready to share with a therapist.
          </Subtitle>

          <StatsGrid>
            <StatBox>
              <StatValue>{moods.length}</StatValue>
              <StatLabel>Mood Logs</StatLabel>
            </StatBox>
            <StatBox>
              <StatValue>{assessments.length}</StatValue>
              <StatLabel>Assessments</StatLabel>
            </StatBox>
            <StatBox>
              <StatValue>{journals.length}</StatValue>
              <StatLabel>CBT Journals</StatLabel>
            </StatBox>
          </StatsGrid>

          <Disclaimer>
            <AlertCircle size={18} />
            <span>This report is generated <strong>entirely on your device</strong>. No data is sent to any server during PDF creation. It is a personal wellness summary — not a clinical or medical document.</span>
          </Disclaimer>

          <Button
            size="lg"
            onClick={generatePDF}
            disabled={generating || (moods.length === 0 && assessments.length === 0 && journals.length === 0)}
            style={{ width: '100%' }}
          >
            {generating ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
            ) : (
              <><Download size={18} /> Download PDF Report</>
            )}
          </Button>

          {moods.length === 0 && assessments.length === 0 && journals.length === 0 && (
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#94A3B8' }}>
              No data found for the last 90 days. Start logging your mood and taking assessments to build your report.
            </p>
          )}
        </Card>
      </Container>
    </PageWrapper>
  );
}
