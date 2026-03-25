'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from '@emotion/styled';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { logger } from '@/lib/logger';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #F8FAFC;
  text-align: center;
`;

const Card = styled.div`
  max-width: 480px;
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 24px 48px -12px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: #FEF2F2;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #0F172A;
  margin-bottom: 12px;
`;

const Message = styled.p`
  color: #64748B;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught application error', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <Card>
            <IconWrapper>
              <AlertCircle size={32} color="#EF4444" />
            </IconWrapper>
            <Title>Something went wrong</Title>
            <Message>
              We've encountered an unexpected error. Our team has been notified, and we're working to fix it.
            </Message>
            <ButtonGroup>
              <Button onClick={() => window.location.reload()} leftIcon={<RefreshCw size={18} />}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'} leftIcon={<Home size={18} />}>
                Go Home
              </Button>
            </ButtonGroup>
          </Card>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
