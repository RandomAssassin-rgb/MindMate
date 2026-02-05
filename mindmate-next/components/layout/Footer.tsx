'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { Brain, Heart, Mail, Phone } from 'lucide-react';
import { MindMateLogo } from '@/components/ui/Logo';

const FooterWrapper = styled.footer`
  background: #FFF7F2;
  border-top: 1px solid rgba(17, 24, 39, 0.06);
`;

const CrisisSection = styled.div`
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
  border-bottom: 1px solid #FECACA;
  padding: 32px 0;
`;

const CrisisContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
`;

const CrisisTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #DC2626;
`;

const CrisisText = styled.p`
  color: #374151;
  font-size: 15px;
  line-height: 1.6;
  max-width: 600px;
`;

const CrisisLinks = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  
  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #DC2626;
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 999px;
    transition: all 180ms;
    
    &:hover {
      background: white;
      transform: translateY(-2px);
    }
  }
`;

const FooterMain = styled.div`
  padding: 64px 0 40px;
  
  @media (max-width: 768px) {
    padding: 48px 0 32px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 60px;
  margin-bottom: 48px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const FooterBrand = styled.div`
  max-width: 320px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const LogoText = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
`;

const BrandDescription = styled.p`
  color: #6B6F76;
  font-size: 15px;
  line-height: 1.7;
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #6B6F76;
  text-decoration: none;
  font-size: 15px;
  padding: 8px 0;
  transition: color 180ms;
  
  &:hover {
    color: #FF6A09;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid rgba(17, 24, 39, 0.08);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #9CA3AF;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 24px;
  
  a {
    color: #9CA3AF;
    font-size: 14px;
    text-decoration: none;
    transition: color 180ms;
    
    &:hover {
      color: #FF6A09;
    }
  }
`;

export function Footer() {
  return (
    <FooterWrapper>
      {/* Crisis Help Section - Separate and prominent */}
      <CrisisSection>
        <CrisisContainer>
          <CrisisTitle>
            <Phone size={20} />
            Need Immediate Help?
          </CrisisTitle>
          <CrisisText>
            If you're in crisis or experiencing thoughts of self-harm, please reach out immediately.
            You are not alone, and help is available 24/7.
          </CrisisText>
          <CrisisLinks>
            <a href="tel:988">📞 Call 988 (Suicide & Crisis Lifeline)</a>
            <a href="sms:741741">💬 Text HOME to 741741</a>
          </CrisisLinks>
        </CrisisContainer>
      </CrisisSection>

      {/* Main Footer Content */}
      <FooterMain>
        <FooterContainer>
          <FooterGrid>
            <FooterBrand>
              <LogoWrapper>
                <MindMateLogo size="small" />
                <LogoText>MindMate</LogoText>
              </LogoWrapper>
              <BrandDescription>
                Your AI-powered mental wellness companion. Track your mood, chat with
                our AI counselor, and access professional support—all in one place.
              </BrandDescription>
            </FooterBrand>

            <FooterColumn>
              <ColumnTitle>Features</ColumnTitle>
              <FooterLink href="/chat">AI Counselor Chat</FooterLink>
              <FooterLink href="/mood">Mood Tracking</FooterLink>
              <FooterLink href="/relax">Meditation Library</FooterLink>
              <FooterLink href="/assessments">Mental Health Assessments</FooterLink>
              <FooterLink href="/video">Video Consultations</FooterLink>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>Resources</ColumnTitle>
              <FooterLink href="/learn">Self-Help Guides</FooterLink>
              <FooterLink href="/learn/cbt">CBT Journaling</FooterLink>
              <FooterLink href="/learn/safety">Safety Planning</FooterLink>
              <FooterLink href="/learn/techniques">Coping Techniques</FooterLink>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>Support</ColumnTitle>
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </FooterColumn>
          </FooterGrid>

          <FooterBottom>
            <Copyright>
              © 2024 MindMate. Made with
              <Heart size={14} fill="#EF4444" color="#EF4444" />
              for mental wellness.
            </Copyright>
            <BottomLinks>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/accessibility">Accessibility</a>
            </BottomLinks>
          </FooterBottom>
        </FooterContainer>
      </FooterMain>
    </FooterWrapper>
  );
}

export default Footer;
