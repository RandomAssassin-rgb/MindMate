'use client';

import styled from '@emotion/styled';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 24px;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: #FFF5F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF6A09;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1B1B1B;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  max-width: 500px;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #F3F4F6;
  color: #1B1B1B;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: #E5E7EB;
    text-decoration: none;
  }
`;

interface ComingSoonProps {
    title?: string;
    description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <Container>
            <IconWrapper>
                <Clock size={40} />
            </IconWrapper>
            <Title>{title || 'Coming Soon'}</Title>
            <Description>
                {description || "We're working hard to bring you this feature. Check back soon for updates!"}
            </Description>
            <BackButton href="/">
                <ArrowLeft size={18} />
                Back to Home
            </BackButton>
        </Container>
    );
}
