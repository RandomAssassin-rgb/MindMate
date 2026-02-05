'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: #FFFBF5;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const RightSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #FFE8D6 0%, #FFD4B8 50%, #FFBF9E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 900px) {
    display: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6A09' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const BrandContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
`;

const BrandLogo = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const BrandTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 16px;
`;

const BrandSubtitle = styled.p`
  font-size: 18px;
  color: #4B5563;
  max-width: 360px;
  line-height: 1.6;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  text-decoration: none;
  margin-bottom: 40px;
`;

const LogoIcon = styled.span`
  font-size: 28px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6B7280;
  font-size: 16px;
  margin-bottom: 32px;
`;

const GoogleButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 24px;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  background: white;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #D1D5DB;
    background: #FAFAFA;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E5E7EB;
  }
  
  span {
    font-size: 14px;
    color: #9CA3AF;
    font-weight: 500;
  }
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

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  font-size: 16px;
  background: #FAFAFA;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #FF6A09;
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 106, 9, 0.1);
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #6B7280;
  }
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  font-size: 14px;
  color: #FF6A09;
  text-decoration: none;
  margin-top: 8px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 16px 24px;
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
  margin-top: 28px;
  box-shadow: 0 4px 16px rgba(255, 106, 9, 0.3);
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(255, 106, 9, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
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

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 12px;
  color: #16A34A;
  font-size: 14px;
  margin-bottom: 20px;
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 28px;
  color: #6B7280;
  font-size: 15px;
  
  a {
    color: #FF6A09;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LeftSection>
        <LoginCard>
          <Logo href="/">
            <LogoIcon>🧠</LogoIcon>
            MindMate
          </Logo>

          <Title>Welcome back</Title>
          <Subtitle>Sign in to continue your wellness journey</Subtitle>

          <AnimatePresence mode="wait">
            {error && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertTriangle size={18} />
                {error}
              </ErrorMessage>
            )}
            {success && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Sparkles size={18} />
                {success}
              </SuccessMessage>
            )}
          </AnimatePresence>

          <GoogleButton
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {googleLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <GoogleIcon viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </GoogleIcon>
                Continue with Google
              </>
            )}
          </GoogleButton>

          <Divider>
            <span>or sign in with email</span>
          </Divider>

          <form onSubmit={handleEmailLogin}>
            <FormGroup>
              <Label>Email</Label>
              <InputWrapper>
                <InputIcon><Mail size={20} /></InputIcon>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <InputWrapper>
                <InputIcon><Lock size={20} /></InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
              <ForgotPassword href="/forgot-password">Forgot password?</ForgotPassword>
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </SubmitButton>
          </form>

          <SignupLink>
            Don't have an account? <Link href="/signup">Sign up free</Link>
          </SignupLink>
        </LoginCard>
      </LeftSection>

      <RightSection>
        <BrandContent>
          <BrandLogo>🧘</BrandLogo>
          <BrandTitle>Your Mind Matters</BrandTitle>
          <BrandSubtitle>
            Track your mood, practice mindfulness, and connect with support whenever you need it.
          </BrandSubtitle>
        </BrandContent>
      </RightSection>
    </PageWrapper>
  );
}
