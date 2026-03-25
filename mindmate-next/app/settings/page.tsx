'use client';

import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, LogOut, ChevronRight, Brain, Trash2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 600px;
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

const Section = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #E2E8F0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #0F172A;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #F1F5F9;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #1E293B;
    font-size: 15px;
  }

  span {
    color: #64748B;
    font-size: 13px;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #E2E8F0;
    transition: .3s;
    border-radius: 34px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: #3B82F6;
  }

  input:checked + span:before {
    transform: translateX(22px);
  }
`;

const TimePicker = styled.input`
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 15px;
  color: #1E293B;
  outline: none;

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  }
`;

const MemoryChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const MemoryKey = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: capitalize;
`;

const MemoryVal = styled.span`
  font-size: 13px;
  color: #0F172A;
  flex: 1;
  margin: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #CBD5E1;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  &:hover { color: #EF4444; background: #FEF2F2; }
`;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

type MemoryItem = { id: string; key: string; value: string };

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);

      const { data: settings } = await supabase
        .from('notification_settings').select('*').eq('user_id', session.user.id).single();
      if (settings) {
        setRemindersEnabled(settings.push_subscription !== null);
        setReminderTime(settings.reminder_time || '20:00');
      }

      setMemoriesLoading(true);
      try {
        const res = await fetch('/api/memory');
        const data = await res.json();
        setMemories(data.memories || []);
      } catch {}
      setMemoriesLoading(false);
      setLoading(false);
    };
    fetchAll();
  }, [router]);

  const handleToggleReminders = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRemindersEnabled(isChecked);
    if (!user) return;

    if (isChecked) {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          let sub = await reg.pushManager.getSubscription();
          if (!sub) {
            const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
            sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
          }
          await supabase.from('notification_settings').upsert({ user_id: user.id, push_subscription: JSON.parse(JSON.stringify(sub)), reminder_time: reminderTime });
        } catch (err) {
          console.error('Push registration failed:', err);
          setRemindersEnabled(false);
          alert('Failed to enable notifications. Allow notifications in your browser settings.');
        }
      } else {
        alert('Push notifications are not supported in this browser.');
        setRemindersEnabled(false);
      }
    } else {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      }
      await supabase.from('notification_settings').upsert({ user_id: user.id, push_subscription: null, reminder_time: reminderTime });
    }
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    setReminderTime(t);
    if (user && remindersEnabled) {
      await supabase.from('notification_settings').upsert({ user_id: user.id, reminder_time: t });
    }
  };

  const handleDeleteMemory = async (key: string) => {
    await fetch('/api/memory', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
    setMemories(prev => prev.filter(m => m.key !== key));
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading) return null;

  return (
    <PageWrapper>
      <Container>
        <PageHeader><Title>Settings</Title></PageHeader>

        {/* Notifications */}
        <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle><Bell size={20} color="#3B82F6" aria-hidden="true" /> Notifications</SectionTitle>
          <SettingRow>
            <SettingLabel>
              <strong>Daily Mood Check-in</strong>
              <span>Get a gentle reminder to track your emotions</span>
            </SettingLabel>
            <Toggle aria-label="Toggle daily mood reminders">
              <input type="checkbox" checked={remindersEnabled} onChange={handleToggleReminders} />
              <span />
            </Toggle>
          </SettingRow>
          {remindersEnabled && (
            <SettingRow>
              <SettingLabel>
                <strong>Reminder Time</strong>
                <span>When would you like to be notified?</span>
              </SettingLabel>
              <TimePicker type="time" value={reminderTime} onChange={handleTimeChange} aria-label="Reminder time" />
            </SettingRow>
          )}
        </Section>

        {/* AI Memory */}
        <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionTitle><Brain size={20} color="#8B5CF6" aria-hidden="true" /> AI Memory</SectionTitle>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>
            MindMate AI remembers context from your conversations to personalise your experience. Delete any item to remove it from the AI's memory.
          </p>
          {memoriesLoading ? (
            <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading…
            </div>
          ) : memories.length === 0 ? (
            <div style={{ fontSize: '14px', color: '#94A3B8', fontStyle: 'italic' }}>No memories yet. Start chatting to build context.</div>
          ) : (
            <>
              {memories.map(m => (
                <MemoryChip key={m.key}>
                  <MemoryKey>{m.key.replace(/_/g, ' ')}</MemoryKey>
                  <MemoryVal>{m.value}</MemoryVal>
                  <DeleteBtn onClick={() => handleDeleteMemory(m.key)} aria-label={`Delete memory: ${m.key}`}>
                    <Trash2 size={14} />
                  </DeleteBtn>
                </MemoryChip>
              ))}
            </>
          )}
        </Section>

        {/* Reports */}
        <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionTitle><FileText size={20} color="#22C55E" aria-hidden="true" /> My Wellness Report</SectionTitle>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>
            Download a private PDF summary of your mood history, assessments, and CBT journals to share with a therapist.
          </p>
          <Button variant="outline" onClick={() => router.push('/report')}>
            <FileText size={16} /> Generate PDF Report
          </Button>
        </Section>

        {/* Account & Privacy */}
        <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionTitle><Shield size={20} color="#3B82F6" aria-hidden="true" /> Account & Privacy</SectionTitle>
          <SettingRow style={{ cursor: 'pointer' }} onClick={() => router.push('/privacy')}>
            <SettingLabel><strong>Privacy Policy</strong><span>How we protect your data</span></SettingLabel>
            <ChevronRight size={20} color="#94A3B8" aria-hidden="true" />
          </SettingRow>
          <SettingRow style={{ cursor: 'pointer' }} onClick={() => router.push('/terms')}>
            <SettingLabel><strong>Terms of Service</strong><span>Our user agreement</span></SettingLabel>
            <ChevronRight size={20} color="#94A3B8" aria-hidden="true" />
          </SettingRow>
          <SettingRow>
            <Button variant="outline" onClick={handleSignOut} leftIcon={<LogOut size={18} />} style={{ marginTop: '8px' }}>
              Sign Out
            </Button>
          </SettingRow>
        </Section>
      </Container>
    </PageWrapper>
  );
}
