'use client';

import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  Hash, Send, Shield, Users, Loader2, Menu, X,
  AlertTriangle, Lock, Copy, Check, Sparkles,
  MessageCircle, Heart, Bell, Eye, EyeOff
} from 'lucide-react';

// Supabase client for realtime
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
interface Session {
  id: string;
  alias: string;
  avatarSeed: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_default: boolean;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; alias: string; avatarSeed: string };
}

// ===============================
// STYLED COMPONENTS - MINDMATE WARM THEME
// ===============================

const AppWrapper = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  margin-top: 80px;
  background: #FFFBF5;
  overflow: hidden;
`;

// Sidebar - Light warm theme
const Sidebar = styled.div<{ isOpen: boolean }>`
  width: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid #F3E8DE;
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${({ isOpen }) => isOpen ? '0' : '-280px'};
    top: 80px;
    bottom: 0;
    z-index: 100;
    transition: left 0.3s ease;
    box-shadow: ${({ isOpen }) => isOpen ? '4px 0 24px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const SidebarHeader = styled.div`
  padding: 28px 20px 20px;
  background: linear-gradient(135deg, #FFE8D6, #FFD4B8);
  border-bottom: 1px solid #F3E8DE;
`;

const ServerName = styled.h2`
  color: #1F2937;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ServerDesc = styled.p`
  color: #6B7280;
  font-size: 13px;
  margin-top: 4px;
`;

const ChannelList = styled.div`
  flex: 1;
  overflow-y: scroll;
  padding: 16px 12px;
  
  /* Always visible scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F3E8DE;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D4C4B5;
    border-radius: 4px;
    
    &:hover {
      background: #C4A68A;
    }
  }
  
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #D4C4B5 #F3E8DE;
`;

const ChannelCategory = styled.div`
  color: #9CA3AF;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 16px 12px 8px;
  letter-spacing: 0.05em;
`;

const ChannelItem = styled.button<{ isActive: boolean; accentColor: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: ${({ isActive }) => isActive ? '#FFE8D6' : 'transparent'};
  color: ${({ isActive }) => isActive ? '#1F2937' : '#6B7280'};
  font-size: 15px;
  font-weight: ${({ isActive }) => isActive ? '600' : '500'};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  border: 2px solid ${({ isActive, accentColor }) => isActive ? accentColor + '40' : 'transparent'};
  
  &:hover {
    background: ${({ isActive }) => isActive ? '#FFE8D6' : '#FFF8F0'};
    color: #1F2937;
  }
`;

const ChannelIcon = styled.span`
  font-size: 20px;
`;

const UserSection = styled.div`
  padding: 16px;
  background: #FFF8F0;
  border-top: 1px solid #F3E8DE;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div<{ seed: string; size?: number }>`
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    hsl(${({ seed }) => Math.abs(seed.charCodeAt(0) * 37) % 360}, 65%, 60%),
    hsl(${({ seed }) => Math.abs(seed.charCodeAt(1) * 47) % 360}, 65%, 50%)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: ${({ size }) => (size || 40) * 0.4}px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  color: #1F2937;
  font-size: 14px;
  font-weight: 600;
`;

const UserStatus = styled.div`
  color: #6B7280;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
`;

const LogoutBtn = styled.button`
  padding: 8px 14px;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  color: #6B7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  
  &:hover {
    background: #E5E7EB;
    color: #374151;
  }
`;

// Main Chat Area
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #FFFBF5;
  min-width: 0;
`;

const ChatHeader = styled.div`
  height: 64px;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid #F3E8DE;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  
  &:hover {
    background: #F3F4F6;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ChannelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1F2937;
  font-weight: 700;
  font-size: 18px;
`;

const ChannelDescription = styled.div`
  color: #9CA3AF;
  font-size: 14px;
  margin-left: auto;
  padding: 6px 12px;
  background: #F9FAFB;
  border-radius: 100px;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const OnlineCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6B7280;
  font-size: 13px;
  padding: 6px 12px;
  background: #F0FDF4;
  border-radius: 100px;
  
  span {
    color: #10B981;
    font-weight: 600;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MessageGroup = styled.div`
  display: flex;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 16px;
  transition: background 0.15s;
  
  &:hover {
    background: rgba(255, 232, 214, 0.4);
  }
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 4px;
`;

const MessageAuthor = styled.span`
  color: #1F2937;
  font-weight: 600;
  font-size: 15px;
`;

const MessageTime = styled.span`
  color: #9CA3AF;
  font-size: 12px;
`;

const MessageText = styled.p`
  color: #374151;
  font-size: 15px;
  line-height: 1.6;
  word-wrap: break-word;
`;

const WelcomeMessage = styled.div`
  padding: 32px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #FFE8D6, #FFD4B8);
  border-radius: 20px;
  text-align: center;
`;

const WelcomeIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const WelcomeTitle = styled.h3`
  color: #1F2937;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const WelcomeText = styled.p`
  color: #4B5563;
  font-size: 15px;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
`;

const SafetyBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: #FEF3C7;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #92400E;
  font-weight: 500;
`;

// Input Area
const InputArea = styled.form`
  padding: 16px 20px 24px;
  flex-shrink: 0;
  background: white;
  border-top: 1px solid #F3E8DE;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  background: #FFFBF5;
  border: 2px solid #F3E8DE;
  border-radius: 16px;
  padding: 4px;
  transition: border-color 0.2s;
  
  &:focus-within {
    border-color: #FF6A09;
  }
`;

const TextInput = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  color: #1F2937;
  font-size: 15px;
  resize: none;
  max-height: 120px;
  font-family: inherit;
  line-height: 1.4;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FF6A09, #FF8534);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(255, 106, 9, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 106, 9, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Session Gate (Login)
const GateOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #FFFBF5 0%, #FFE8D6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
`;

const GateCard = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(255, 106, 9, 0.12), 0 4px 20px rgba(0,0,0,0.05);
`;

const GateHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const GateIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, #FFE8D6, #FFD4B8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
`;

const GateTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
`;

const GateSubtitle = styled.p`
  color: #6B7280;
  font-size: 15px;
`;

const TabGroup = styled.div`
  display: flex;
  background: #F3F4F6;
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 28px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ active }) => active ? 'white' : 'transparent'};
  color: ${({ active }) => active ? '#FF6A09' : '#6B7280'};
  box-shadow: ${({ active }) => active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  font-size: 16px;
  background: #FAFAFA;
  
  &:focus {
    outline: none;
    border-color: #FF6A09;
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 106, 9, 0.1);
  }
`;

const PinContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const PinDigit = styled.input`
  width: 52px;
  height: 60px;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  background: #FAFAFA;
  
  &:focus {
    outline: none;
    border-color: #FF6A09;
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 106, 9, 0.1);
  }
`;

const PrimaryButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #FF6A09, #FF8534);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  box-shadow: 0 4px 16px rgba(255, 106, 9, 0.3);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RecoveryCard = styled.div`
  background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
  border: 2px solid #6EE7B7;
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
  text-align: center;
`;

const RecoveryCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 12px 0;
  padding: 14px;
  background: white;
  border-radius: 12px;
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  color: #065F46;
`;

const CopyBtn = styled.button`
  background: #D1FAE5;
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: #065F46;
  cursor: pointer;
`;

const ErrorMsg = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 12px;
  color: #DC2626;
  font-size: 14px;
  margin-bottom: 20px;
`;

const MobileOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    top: 80px;
    background: rgba(0,0,0,0.3);
    z-index: 99;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9CA3AF;
  text-align: center;
`;

// Helper
function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  if (isToday) return time;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${time}`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${time}`;
}

// ===============================
// MAIN COMPONENT
// ===============================

export default function CommunityPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('community_session');
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem('community_session');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch('/api/community/channels')
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels || []);
        const defaultChannel = data.channels?.find((c: Channel) => c.is_default);
        if (defaultChannel) setActiveChannel(defaultChannel);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (activeChannel && session) {
      fetchMessages();
    }
  }, [activeChannel, session]);

  useEffect(() => {
    if (!activeChannel || !session) return;

    const channel = supabase
      .channel(`messages:${activeChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        async (payload) => {
          const { data } = await supabase
            .from('community_messages')
            .select(`
              id, content, created_at,
              session:anonymous_sessions!inner(id, alias, avatar_seed)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const newMsg: Message = {
              id: data.id,
              content: data.content,
              createdAt: data.created_at,
              author: {
                id: (data.session as any).id,
                alias: (data.session as any).alias,
                avatarSeed: (data.session as any).avatar_seed
              }
            };

            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel?.id, session]);



  // Keep track of latest messages for autonomous bots
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Sync logout with main app
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        handleLogout();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Notification Subscription
  useEffect(() => {
    if (!session) return;

    // Fetch initial
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('community_notifications')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };
    fetchNotifications();

    // Subscribe
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'community_notifications',
        filter: `session_id=eq.${session.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        // Play sound? maybe later
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleNotificationClick = async (notif: any) => {
    // Mark as read
    await supabase.from('community_notifications').update({ is_read: true }).eq('id', notif.id);

    // Update local state
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Switch channel
    const channel = channels.find(c => c.id === notif.channel_id);
    if (channel) {
      setActiveChannel(channel);
      if (window.innerWidth < 768) setSidebarOpen(false);
      setShowNotifications(false);
    }
  };

  // Autonomous bot activity - bots chat on their own!
  useEffect(() => {
    if (!activeChannel || !session) return;

    const triggerBotActivity = async () => {
      const mode = Math.random() < 0.4 ? 'initiate' : 'respond'; // 40% initiate, 60% respond

      try {
        await fetch(`/api/community/channels/${activeChannel.id}/messages`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recentMessages: messagesRef.current.slice(-8),
            mode
          })
        });
      } catch (err) {
        // Silently fail - bots are optional
      }
    };

    // Random interval between 30-90 seconds
    const scheduleNext = () => {
      const delay = 30000 + Math.random() * 60000; // 30-90 seconds
      return setTimeout(() => {
        triggerBotActivity();
        botTimerRef.current = scheduleNext();
      }, delay);
    };

    const botTimerRef = { current: scheduleNext() };

    // Initial bot activity after 5-15 seconds
    const initialDelay = setTimeout(() => {
      triggerBotActivity();
    }, 5000 + Math.random() * 10000);

    return () => {
      clearTimeout(botTimerRef.current);
      clearTimeout(initialDelay);
    };
  }, [activeChannel?.id, session]);

  const fetchMessages = async () => {
    if (!activeChannel) return;
    try {
      const res = await fetch(`/api/community/channels/${activeChannel.id}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // "Conversation Manager" - Triggers bot replies to keep conversation flowing
  useEffect(() => {
    if (!activeChannel || !session || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const isMe = lastMsg.author.id === session.id;

    // Don't trigger on old messages loaded from history (check if message is < 10s old)
    const msgTime = new Date(lastMsg.createdAt).getTime();
    if (Date.now() - msgTime > 10000) return;

    // Logic:
    // 1. If ME sent it: 65% chance for bot to reply (High engagement)
    // 2. If BOT sent it: 45% chance for ANOTHER bot to reply (Chain reaction)

    const triggerChance = isMe ? 0.65 : 0.45;

    if (Math.random() < triggerChance) {
      const delay = 3000 + Math.random() * 5000; // 3-8 seconds

      const timer = setTimeout(async () => {
        try {
          await fetch(`/api/community/channels/${activeChannel.id}/messages`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recentMessages: messages.slice(-8),
              mode: 'respond'
            })
          });
        } catch (err) {
          // Ignore
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [messages, activeChannel?.id, session]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || !activeChannel || sending) return;

    const content = input.trim();
    setInput('');
    setSending(true);

    try {
      await fetch(`/api/community/channels/${activeChannel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, content })
      });
      // Removed manual bot trigger - verified handled by Conversation Manager effect
    } catch (error) {
      setInput(content);
    }

    setSending(false);

    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('community_session');
    setSession(null);
    setMessages([]);
  };

  const handleSessionCreated = (newSession: Session) => {
    localStorage.setItem('community_session', JSON.stringify(newSession));
    setSession(newSession);
  };

  if (loading) {
    return (
      <AppWrapper>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#FF6A09' }} />
        </div>
      </AppWrapper>
    );
  }

  if (!session) {
    return <SessionGate onSessionCreated={handleSessionCreated} />;
  }

  return (
    <AppWrapper>
      <MobileOverlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <ServerName>
            <Heart size={22} fill="#FF6A09" color="#FF6A09" />
            MindMate Community
          </ServerName>
          <ServerDesc>A safe space to connect</ServerDesc>

          {/* Notification Bell */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                width: '100%',
                fontSize: 14,
                color: '#4B5563',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute', top: -5, right: -5,
                    background: '#EF4444', color: 'white',
                    fontSize: 10, borderRadius: '50%',
                    width: 14, height: 14, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </div>
                )}
              </div>
              <span>Notifications</span>
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, right: 0,
                background: 'white', border: '1px solid #E5E7EB',
                borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 50, maxHeight: 300, overflowY: 'auto'
              }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer',
                        background: n.is_read ? 'white' : '#FEF2F2'
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: n.is_read ? 400 : 600 }}>{n.content}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </SidebarHeader>

        <ChannelList>
          <ChannelCategory>Support Channels</ChannelCategory>
          {channels.map(channel => (
            <ChannelItem
              key={channel.id}
              isActive={activeChannel?.id === channel.id}
              accentColor={channel.color}
              onClick={() => {
                setActiveChannel(channel);
                setSidebarOpen(false);
              }}
            >
              <ChannelIcon>{channel.icon}</ChannelIcon>
              {channel.name}
            </ChannelItem>
          ))}
        </ChannelList>

        <UserSection>
          <Avatar seed={session.avatarSeed} size={40}>
            {session.alias.charAt(0)}
          </Avatar>
          <UserInfo>
            <UserName>{session.alias}</UserName>
            <UserStatus>
              <StatusDot /> Online
            </UserStatus>
          </UserInfo>
          <LogoutBtn onClick={handleLogout}>Leave</LogoutBtn>
        </UserSection>
      </Sidebar>

      <ChatArea>
        <ChatHeader>
          <MobileMenuBtn onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </MobileMenuBtn>
          <ChannelTitle>
            <span style={{ fontSize: 24 }}>{activeChannel?.icon}</span>
            {activeChannel?.name || 'Select a channel'}
          </ChannelTitle>
          <OnlineCount>
            <StatusDot /> <span>Online</span>
          </OnlineCount>
        </ChatHeader>

        <MessagesArea>
          <SafetyBanner>
            <Shield size={16} />
            In crisis? Call <strong>988</strong> or text <strong>HOME</strong> to <strong>741741</strong>
          </SafetyBanner>

          {activeChannel && (
            <WelcomeMessage>
              <WelcomeIcon>{activeChannel.icon}</WelcomeIcon>
              <WelcomeTitle>Welcome to #{activeChannel.name}</WelcomeTitle>
              <WelcomeText>
                {activeChannel.description}. This is a safe, anonymous space to share and support each other.
              </WelcomeText>
            </WelcomeMessage>
          )}

          {messages.length === 0 ? (
            <EmptyState>
              <MessageCircle size={48} strokeWidth={1} />
              <p style={{ marginTop: 12, fontSize: 15 }}>No messages yet. Be the first to share!</p>
            </EmptyState>
          ) : (
            messages.map((msg) => (
              <MessageGroup key={msg.id}>
                <Avatar seed={msg.author.avatarSeed} size={40}>
                  {msg.author.alias.charAt(0)}
                </Avatar>
                <MessageContent>
                  <MessageHeader>
                    <MessageAuthor>{msg.author.alias}</MessageAuthor>
                    <MessageTime>{formatMessageTime(msg.createdAt)}</MessageTime>
                  </MessageHeader>
                  <MessageText>{msg.content}</MessageText>
                </MessageContent>
              </MessageGroup>
            ))
          )}

          <div ref={messagesEndRef} />
        </MessagesArea>

        <InputArea onSubmit={handleSend}>
          <InputWrapper>
            <TextInput
              ref={textareaRef}
              placeholder={`Message #${activeChannel?.name || 'channel'}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={1000}
            />
            <SendButton type="submit" disabled={!input.trim() || sending}>
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </SendButton>
          </InputWrapper>
        </InputArea>
      </ChatArea>
    </AppWrapper>
  );
}

// ===============================
// SESSION GATE COMPONENT
// ===============================

function SessionGate({ onSessionCreated }: { onSessionCreated: (session: Session) => void }) {
  const [mode, setMode] = useState<'create' | 'login' | 'recover'>('create');
  const [alias, setAlias] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdSession, setCreatedSession] = useState<{ session: Session; recoveryCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    if (value && index < 5) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const getPinString = () => pin.join('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pinString = getPinString();
    if (pinString.length !== 6) {
      setError('Please enter a 6-digit PIN');
      return;
    }

    setLoading(true);

    try {
      const action = mode === 'create' ? 'create' : mode === 'login' ? 'verify' : 'recover';
      const body: any = { action, pin: pinString };

      if (mode !== 'create' || alias) body.alias = alias.trim();
      if (mode === 'recover') body.recoveryCode = recoveryCode.trim().toUpperCase();

      const res = await fetch('/api/community/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (mode === 'create') {
        setCreatedSession({ session: data.session, recoveryCode: data.recoveryCode });
      } else {
        onSessionCreated(data.session);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (createdSession) {
    return (
      <GateOverlay>
        <GateCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GateHeader>
            <GateIcon>🎉</GateIcon>
            <GateTitle>Welcome, {createdSession.session.alias}!</GateTitle>
            <GateSubtitle>Your anonymous identity is ready</GateSubtitle>
          </GateHeader>

          <RecoveryCard>
            <AlertTriangle size={24} color="#F59E0B" />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#065F46', marginTop: 8 }}>
              Save Your Recovery Code
            </p>
            <p style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>
              You'll need this if you forget your PIN
            </p>
            <RecoveryCode>
              {createdSession.recoveryCode}
              <CopyBtn onClick={() => {
                navigator.clipboard.writeText(createdSession.recoveryCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </CopyBtn>
            </RecoveryCode>
          </RecoveryCard>

          <PrimaryButton
            onClick={() => onSessionCreated(createdSession.session)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={18} />
            Enter Community
          </PrimaryButton>
        </GateCard>
      </GateOverlay>
    );
  }

  return (
    <GateOverlay>
      <GateCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GateHeader>
          <GateIcon>
            {mode === 'create' ? '✨' : mode === 'login' ? '👋' : '🔑'}
          </GateIcon>
          <GateTitle>
            {mode === 'create' ? 'Join Community' : mode === 'login' ? 'Welcome Back' : 'Reset PIN'}
          </GateTitle>
          <GateSubtitle>
            {mode === 'create' ? 'Create an anonymous identity to chat' : 'Enter your credentials'}
          </GateSubtitle>
        </GateHeader>

        <TabGroup>
          <Tab active={mode === 'create'} onClick={() => { setMode('create'); setError(''); }}>New</Tab>
          <Tab active={mode === 'login'} onClick={() => { setMode('login'); setError(''); }}>Login</Tab>
          <Tab active={mode === 'recover'} onClick={() => { setMode('recover'); setError(''); }}>Recover</Tab>
        </TabGroup>

        <form onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <ErrorMsg initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AlertTriangle size={16} /> {error}
              </ErrorMsg>
            )}
          </AnimatePresence>

          <FormGroup>
            <Label>{mode === 'create' ? 'Choose an alias (optional)' : 'Your alias'}</Label>
            <Input
              placeholder={mode === 'create' ? 'Leave blank for random' : 'Enter your alias'}
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required={mode !== 'create'}
            />
          </FormGroup>

          {mode === 'recover' && (
            <FormGroup>
              <Label>Recovery code</Label>
              <Input
                placeholder="HOPE-STAR-CALM-WAVE-RISE-HEAL"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{mode === 'recover' ? 'New 6-digit PIN' : '6-digit PIN'}</span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  padding: '4px 8px',
                  borderRadius: 6,
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPin ? 'Hide' : 'Show'}
              </button>
            </Label>
            <PinContainer>
              {pin.map((digit, i) => (
                <PinDigit
                  key={i}
                  id={`pin-${i}`}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  maxLength={1}
                />
              ))}
            </PinContainer>
          </FormGroup>

          <PrimaryButton type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              mode === 'create' ? 'Create & Join' : mode === 'login' ? 'Enter Community' : 'Reset & Enter'
            )}
          </PrimaryButton>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, color: '#6B7280', fontSize: 13 }}>
          <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          100% anonymous • Your identity is never shared
        </div>
      </GateCard>
    </GateOverlay>
  );
}
