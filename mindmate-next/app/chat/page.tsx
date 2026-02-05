'use client';

import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Lightbulb, Heart, Moon, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
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

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      <ChatContainer>
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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <SendButton type="submit" disabled={!input.trim() || isLoading}>
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </PageWrapper>
  );
}
