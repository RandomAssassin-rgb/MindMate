'use client';

import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Lightbulb, Heart, Moon, Brain, Zap, Lock, Menu, Plus, MessageSquare, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
  position: relative;
  overflow: hidden;
`;

const Sidebar = styled(motion.div)<{ isOpen: boolean }>`
  width: 280px;
  background: white;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 20;

  @media (min-width: 1024px) {
    position: relative;
    transform: none !important;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConversationItem = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ active }) => active ? '#F1F5F9' : 'transparent'};
  border-radius: 12px;
  color: #1E293B;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ active }) => active ? '#F1F5F9' : '#F8FAFC'};
  }
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  position: relative;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #E2E8F0;
  gap: 12px;
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const ChatHeader = styled(motion.div)`
  text-align: center;
  padding: 40px 0 24px;
`;

const HeaderIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.3);
`;

const ChatTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 8px;
  
  span {
    background: linear-gradient(135deg, #8B5CF6, #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const ChatSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  max-width: 400px;
  margin: 0 auto;
`;

const CrisisNotice = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
  border: 1px solid #FECACA;
  border-radius: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  
  svg {
    color: #EF4444;
    flex-shrink: 0;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageWrapper = styled(motion.div) <{ isUser: boolean }>`
  display: flex;
  gap: 12px;
  justify-content: ${({ isUser }) => isUser ? 'flex-end' : 'flex-start'};
  max-width: 85%;
  align-self: ${({ isUser }) => isUser ? 'flex-end' : 'flex-start'};
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ isUser }) =>
    isUser ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'linear-gradient(135deg, #8B5CF6, #A78BFA)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  order: ${({ isUser }) => isUser ? 1 : 0};
  box-shadow: 0 4px 12px ${({ isUser }) => isUser ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'};
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 16px 20px;
  border-radius: ${({ isUser }) => isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
  background: ${({ isUser }) =>
    isUser ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'white'};
  color: ${({ isUser }) => isUser ? 'white' : '#1F2937'};
  box-shadow: ${({ isUser }) => isUser
    ? '0 4px 15px rgba(59, 130, 246, 0.25)'
    : '0 2px 10px rgba(0, 0, 0, 0.06)'};
  line-height: 1.6;
  font-size: 15px;
`;

const SuggestionChips = styled(motion.div)`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const SuggestionChip = styled(motion.button) <{ color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 100px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    color: ${({ color }) => color};
  }
  
  &:hover {
    border-color: ${({ color }) => color};
    background: ${({ color }) => color}10;
    transform: translateY(-2px);
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 20px 20px 20px 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  max-width: fit-content;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 8px;
    height: 8px;
    background: #8B5CF6;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
    
    &:nth-of-type(1) { animation-delay: 0s; }
    &:nth-of-type(2) { animation-delay: 0.2s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
  }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
`;

const InputContainer = styled.div`
  padding: 24px;
  background: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
`;

const InputWrapper = styled.form`
  display: flex;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 16px 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  font-family: inherit;
  font-size: 15px;
  resize: none;
  min-height: 56px;
  max-height: 150px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const SendButton = styled(Button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #7C3AED, #6D28D9);
  }
`;

const AuthGateOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  z-index: 10;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 4px 0 8px;
  }
  
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 12px;
  }
`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  { text: "I'm feeling anxious today", icon: Heart, color: '#EC4899' },
  { text: "Help me with stress", icon: Zap, color: '#F59E0B' },
  { text: "I can't sleep well", icon: Moon, color: '#8B5CF6' },
  { text: "I need motivation", icon: Lightbulb, color: '#22C55E' }
];

const aiResponses = [
  "I hear you, and I want you to know that your feelings are completely valid. Let's work through this together. Can you tell me more about what's been troubling you?",
  "Thank you for sharing that with me. It takes real courage to open up. I'm here to listen and support you. Have you tried any relaxation techniques like deep breathing or grounding exercises?",
  "I understand how challenging this can feel. Remember, it's okay to take things one step at a time. What would feel most helpful for you right now?",
  "Your feelings matter, and many people experience similar challenges. Would you like me to suggest some evidence-based coping strategies that might help?",
  "That sounds really tough. I'm glad you're here talking about it. Sometimes just expressing our feelings can bring some relief. What else is on your mind?"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 I'm your MindMate AI companion. I'm here to listen, support, and help you navigate whatever you're feeling. This is a safe, judgment-free space. How are you doing today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Fetch conversations
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setConversations(data);
        }
      }
    };
    initChat();
  }, []);

  const loadConversation = async (id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
    
    // Fetch messages
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setMessages(data.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content
      })));
    } else {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hi there! 👋 I'm your MindMate AI companion. I'm here to listen, support, and help you navigate whatever you're feeling. How are you doing today?"
      }]);
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 I'm your MindMate AI companion. I'm here to listen, support, and help you navigate whatever you're feeling. How are you doing today?"
    }]);
    setSidebarOpen(false);
  };

  const showAuthGate = !user && messages.length >= 3;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || showAuthGate) return;

    let currentConversationId = activeConversationId;

    // Create conversation if none exists and user is logged in
    if (!currentConversationId && user) {
      const title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ user_id: user.id, title }])
        .select()
        .single();
      
      if (data) {
        currentConversationId = data.id;
        setActiveConversationId(data.id);
        setConversations(prev => [data, ...prev]);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message
    if (currentConversationId && user) {
      await supabase.from('messages').insert([{
        conversation_id: currentConversationId,
        role: 'user',
        content: text
      }]);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI message
      if (currentConversationId && user) {
        await supabase.from('messages').insert([{
          conversation_id: currentConversationId,
          role: 'assistant',
          content: data.message
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please call 988 or text HOME to 741741."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageWrapper>
      {/* Sidebar for conversations */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 15 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar
        isOpen={sidebarOpen}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0) }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <SidebarHeader>
          <Button fullWidth onClick={startNewChat} leftIcon={<Plus size={18} />} variant="secondary">
            New Chat
          </Button>
        </SidebarHeader>
        
        <ConversationList>
          {!user ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748B', fontSize: '14px' }}>
              Sign in to save your conversation history.
            </div>
          ) : (
            conversations.map(conv => (
              <ConversationItem 
                key={conv.id} 
                active={activeConversationId === conv.id}
                onClick={() => loadConversation(conv.id)}
              >
                <MessageSquare size={16} color="#64748B" />
                <span>{conv.title}</span>
              </ConversationItem>
            ))
          )}
        </ConversationList>
      </Sidebar>

      <MainContent>
        <TopBar>
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Menu size={20} color="#475569" />
          </button>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>
            {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.title : 'New Chat'}
          </div>
        </TopBar>

        <ChatContainer>
          {!activeConversationId && messages.length <= 2 && (
            <ChatHeader
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeaderIcon>
                <Sparkles size={36} color="white" />
              </HeaderIcon>
              <ChatTitle>
                Chat with <span>MindMate AI</span>
              </ChatTitle>
              <ChatSubtitle>
                Your 24/7 mental wellness companion, here to listen and support you
              </ChatSubtitle>
            </ChatHeader>
          )}

          {!activeConversationId && (
            <CrisisNotice
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AlertCircle size={20} />
              <span>
                <strong>Not a replacement for professional help.</strong> In crisis, call <strong>988</strong> or text <strong>HOME to 741741</strong>
              </span>
            </CrisisNotice>
          )}

        {messages.length === 1 && (
          <SuggestionChips
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {suggestions.map((suggestion, i) => (
              <SuggestionChip
                key={suggestion.text}
                color={suggestion.color}
                onClick={() => sendMessage(suggestion.text)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <suggestion.icon size={16} />
                {suggestion.text}
              </SuggestionChip>
            ))}
          </SuggestionChips>
        )}

        <MessagesContainer>
          <AnimatePresence>
            {messages.map(message => (
              <MessageWrapper
                key={message.id}
                isUser={message.role === 'user'}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar isUser={message.role === 'user'}>
                  {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </Avatar>
                <MessageBubble isUser={message.role === 'user'}>
                  {message.content}
                </MessageBubble>
              </MessageWrapper>
            ))}
          </AnimatePresence>

          {isLoading && (
            <MessageWrapper isUser={false}>
              <Avatar isUser={false}>
                <Bot size={20} />
              </Avatar>
              <TypingIndicator
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <TypingDots>
                  <span /><span /><span />
                </TypingDots>
                <span style={{ fontSize: '13px', color: '#64748B' }}>MindMate is thinking...</span>
              </TypingIndicator>
            </MessageWrapper>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ChatContainer>

      <InputContainer>
        <InputWrapper onSubmit={handleSubmit}>
          {showAuthGate && (
            <AuthGateOverlay
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#8B5CF6" />
                <h3>Sign in to continue chatting</h3>
              </div>
              <p>Create a free account to save your progress and access all features.</p>
              <Button 
                onClick={() => router.push('/login?redirect=/chat')}
                size="sm"
                style={{ borderRadius: '100px' }}
              >
                Create Free Account
              </Button>
            </AuthGateOverlay>
          )}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={showAuthGate ? "" : "Share what's on your mind..."}
            rows={1}
            disabled={showAuthGate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <SendButton type="submit" disabled={!input.trim() || isLoading || showAuthGate}>
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
          </SendButton>
        </InputWrapper>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#94A3B8' }}>
          MindMate AI can make mistakes. Always consult a licensed therapist for personal diagnosis or treatment.
        </div>
      </InputContainer>
      </MainContent>
    </PageWrapper>
  );
}
