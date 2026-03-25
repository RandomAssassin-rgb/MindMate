'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FileText, Mail, AlertTriangle } from 'lucide-react';

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

const DisclaimerBox = styled.div`
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-left: 4px solid #EF4444;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 40px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
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

  p {
    margin-bottom: 16px;
  }
`;

export default function TermsOfServicePage() {
  return (
    <PageWrapper>
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Header>
          <IconWrapper>
            <FileText size={32} color="#3B82F6" />
          </IconWrapper>
          <Title>Terms of Service</Title>
          <LastUpdated>Last Updated: March 2026</LastUpdated>
        </Header>

        <DisclaimerBox>
          <AlertTriangle size={28} color="#EF4444" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ color: '#991B1B', marginTop: 0, marginBottom: '8px', fontSize: '18px' }}>
              Not a Substitute for Professional Medical Care
            </h3>
            <p style={{ margin: 0, color: '#991B1B', fontSize: '15px' }}>
              MindMate is an AI-powered wellness tool designed for self-reflection and emotional support. <strong>We do not provide medical advice, psychiatric diagnosis, or treatment.</strong> If you are experiencing a mental health crisis, feeling suicidal, or needing immediate help, please call <strong>988</strong> or text <strong>HOME</strong> to <strong>741741</strong> immediately.
            </p>
          </div>
        </DisclaimerBox>

        <Content>
          <h2>1. Scope of the Service</h2>
          <p>
            MindMate provides digital tools including an AI conversational agent, mood tracking dashboards, and educational mental health content. Our tools are designed to encourage healthy habits and self-understanding. By using MindMate, you agree that you are utilizing the app solely for self-guided wellness and not as a replacement for advice from licensed healthcare providers.
          </p>

          <h2>2. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when creating an account and logging your experiences. MindMate is intended for users who are 13 years of age or older. By using the app, you confirm you meet this requirement.
          </p>

          <h2>3. Interactions with the AI Companion</h2>
          <p>
            While our AI is instructed using clinical principles such as Cognitive Behavioral Therapy (CBT), it is an automated system subject to limitations. It cannot understand nuance like a human therapist, and it may sometimes generate unexpected or unhelpful responses. You agree to use the AI companion with this understanding and not to rely upon it for critical health decisions.
          </p>

          <h2>4. Community Conduct</h2>
          <p>
            Our Community Forum is a space for support. You agree not to post content that is:
          </p>
          <ul>
            <li>Harassing, bullying, or threatening to others.</li>
            <li>Providing medical advice or encouraging dangerous behaviors.</li>
            <li>Advertising or spamming products/services.</li>
          </ul>
          <p>We reserve the right to move, hide, or delete any content and suspend accounts that violate these rules.</p>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, MindMate and its creators shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your access to, or use of, our services. We provide the application "as is" without any warranties regarding its efficacy for treating any medical or psychiatric condition.
          </p>

          <h2>6. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which the service is operated. Any disputes arising from these terms shall be resolved in the courts of that jurisdiction.
          </p>

          <h2>5. Modifications to the Service</h2>
          <p>
            We may update, modify, or permanently discontinue certain features within MindMate at our discretion. We will do our best to notify users of any major changes, but we reserve the right to alter the service framework at any time.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service or how they apply to you, please contact us.
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontWeight: 500 }}>
            <Mail size={18} />
            legal@mindmate.app
          </p>
        </Content>
        </motion.div>
      </Container>
    </PageWrapper>
  );
}
