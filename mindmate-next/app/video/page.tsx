'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Video, Calendar, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 50%, #FFFBF7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const Container = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 32px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #EFF6FF;
  color: #2563EB;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 16px;
  
  span {
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 40px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  background: #F8FAFC;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 40px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  
  svg {
    color: #22C55E;
    flex-shrink: 0;
  }
`;

const InputGroup = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  input {
    flex: 1;
    padding: 0 20px;
    border-radius: 14px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    font-size: 16px;
    outline: none;
    transition: all 0.2s;
    
    &:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    input {
      height: 52px;
    }
  }
`;

const StatusMessage = styled(motion.div)<{ isError?: boolean }>`
  color: ${({ isError }) => isError ? '#EF4444' : '#22C55E'};
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
`;

export default function VideoComingSoonPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const { error } = await supabase
        .from('video_waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          setStatus('success');
          setMessage("You're already on the list! We'll be in touch soon.");
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage("Thanks for joining! You'll be the first to know when it's ready.");
        setEmail('');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      setStatus('error');
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <PageWrapper>
      <Container
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <IconWrapper>
          <Video size={36} color="white" />
        </IconWrapper>
        
        <Badge>
          <Sparkles size={16} /> Coming Soon
        </Badge>
        
        <Title>
          Video <span>Consultations</span>
        </Title>
        
        <Description>
          We're building a seamless way to connect with licensed mental health professionals directly through MindMate.
        </Description>
        
        <FeatureList>
          <Feature>
            <Check size={20} />
            Secure, end-to-end encrypted video sessions
          </Feature>
          <Feature>
            <Check size={20} />
            Match with vetted, licensed therapists
          </Feature>
          <Feature>
            <Check size={20} />
            Share your MindMate AI context with your provider
          </Feature>
        </FeatureList>

        <InputGroup onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            required
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            loading={status === 'loading'}
            rightIcon={status !== 'success' ? <ArrowRight size={18} /> : undefined}
            style={{ height: '52px', borderRadius: '14px' }}
          >
            {status === 'success' ? 'Joined!' : 'Join Waitlist'}
          </Button>
        </InputGroup>
        
        {status === 'success' || status === 'error' ? (
          <StatusMessage 
            isError={status === 'error'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </StatusMessage>
        ) : null}
      </Container>
    </PageWrapper>
  );
}
