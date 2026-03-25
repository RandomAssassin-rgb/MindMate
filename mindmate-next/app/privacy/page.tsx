'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 24px 48px -12px rgba(0, 0, 0, 0.1);
  padding: 60px;
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: #EFF6FF;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #0F172A;
  margin-bottom: 12px;
`;

const LastUpdated = styled.p`
  color: #64748B;
  font-size: 15px;
`;

const Content = styled.div`
  color: #334155;
  line-height: 1.8;
  font-size: 16px;

  h2 {
    color: #0F172A;
    font-size: 24px;
    margin: 40px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #E2E8F0;
  }

  h3 {
    color: #0F172A;
    font-size: 18px;
    margin: 24px 0 12px;
  }

  p {
    margin-bottom: 16px;
  }

  ul {
    margin-bottom: 16px;
    padding-left: 24px;
    
    li {
      margin-bottom: 8px;
    }
  }
`;

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper>
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Header>
          <IconWrapper>
            <Shield size={32} color="#3B82F6" />
          </IconWrapper>
          <Title>Privacy Policy</Title>
          <LastUpdated>Last Updated: March 2026</LastUpdated>
        </Header>

        <Content>
          <p>
            At MindMate, we understand that mental health is deeply personal. Your trust and privacy are our top priorities. This Privacy Policy explains how we collect, use, and protect your information in plain English, without the confusing legal jargon.
          </p>

          <h2>1. Information We Collect</h2>
          <p>To provide you with a personalized and supportive experience, we collect specific types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> When you sign up, we collect your email address and basic profile information to create and secure your account.</li>
            <li><strong>Mood Logs:</strong> If you use our mood tracking feature, we safely store the mood scores, activities, and private notes you log.</li>
            <li><strong>Chat Conversations:</strong> We save the contents of your AI chat history so that the companion can offer continuous, context-aware support.</li>
          </ul>

          <h2>2. How We Store Your Data</h2>
          <p>
            Your data is stored securely using Supabase, a robust and secure database provider. All of your personal health information, including mood logs and chat messages, is encrypted at rest. Furthermore, we enforce strict Row Level Security (RLS) right at the database layer, meaning your data is mathematically siloed and cannot be accessed by other users.
          </p>

          <h2>3. Data Security Protocols</h2>
          <p>
            We employ industry-standard technical and organizational measures to protect your information:
          </p>
          <ul>
            <li><strong>Transit Encryption:</strong> All data is encrypted using Transport Layer Security (TLS) when moving between your device and our servers.</li>
            <li><strong>At-Rest Encryption:</strong> All user records are stored with AES-256 encryption within our Supabase database.</li>
            <li><strong>Isolated Environments:</strong> Our development and production data environments are strictly separated.</li>
          </ul>

          <h2>4. We Do Not Sell Your Data</h2>
          <p>
            <strong>MindMate will never sell, rent, or share your personal data with advertisers or third-party data brokers.</strong> We do not use your personal conversations or journals to train our AI models or third-party models. The data shared with API providers (like Groq) is used solely to generate a response for your current session.
          </p>

          <h2>4. Your Right to Delete</h2>
          <p>
            You own your data. You have the right to request a complete deletion of your account and all associated data at any time. When you choose to delete your account, we permanently erase your mood logs, journal entries, and chat history from our servers.
          </p>

          <h2>5. Third-Party Processors</h2>
          <p>
            To provide the AI companion functionality, we securely transmit your chat messages to Groq's Large Language Model API. We have structured this integration to prioritize your privacy, and we do not use your personal conversations to train our own models.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding your data and privacy, please reach out to us directly.
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontWeight: 500 }}>
            <Mail size={18} />
            privacy@mindmate.app
          </p>
        </Content>
        </motion.div>
      </Container>
    </PageWrapper>
  );
}
