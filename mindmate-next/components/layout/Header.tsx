'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Brain, MessageCircle, Activity, BookOpen,
    Video, User, Phone, Heart
} from 'lucide-react';
import { Button } from '../ui/Button';

const HeaderWrapper = styled.header<{ scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ scrolled, theme }) =>
        scrolled ? 'rgba(255, 251, 247, 0.95)' : theme.colors.bg};
  backdrop-filter: ${({ scrolled }) => scrolled ? 'blur(12px)' : 'none'};
  border-bottom: 1px solid ${({ scrolled, theme }) =>
        scrolled ? theme.colors.border : 'transparent'};
  transition: all ${({ theme }) => theme.motion.normal} ${({ theme }) => theme.motion.easeOut};
`;

const HeaderContainer = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.layout.headerHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 22px;
  font-weight: ${({ theme }) => theme.typography.bold};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.typography.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SOSButton = styled(Button)`
  background: ${({ theme }) => theme.colors.error};
  
  &:hover {
    background: #DC2626;
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.35);
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.md};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: ${({ theme }) => theme.layout.headerHeight};
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 99;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: ${({ theme }) => theme.typography.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const navItems = [
    { href: '/relax', label: 'Relax', icon: Heart },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/mood', label: 'Mood', icon: Activity },
    { href: '/video', label: 'Video Consult', icon: Video },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <HeaderWrapper scrolled={scrolled}>
            <HeaderContainer>
                <Logo href="/">
                    <Brain size={32} />
                    MindMate
                </Logo>

                <Nav>
                    {navItems.map((item) => (
                        <NavLink key={item.href} href={item.href}>
                            <item.icon />
                            {item.label}
                        </NavLink>
                    ))}
                </Nav>

                <HeaderActions>
                    <SOSButton size="sm" leftIcon={<Phone size={16} />}>
                        SOS
                    </SOSButton>
                    <Button variant="primary" size="sm">
                        Get Help Now
                    </Button>
                    <NavLink href="/profile" style={{ marginLeft: '8px' }}>
                        <User />
                    </NavLink>
                    <MobileMenuButton
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </MobileMenuButton>
                </HeaderActions>
            </HeaderContainer>

            <AnimatePresence>
                {mobileOpen && (
                    <MobileMenu
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navItems.map((item) => (
                            <MobileNavLink
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                            >
                                <item.icon size={24} />
                                {item.label}
                            </MobileNavLink>
                        ))}
                        <MobileNavLink href="/profile" onClick={() => setMobileOpen(false)}>
                            <User size={24} />
                            My Profile
                        </MobileNavLink>
                    </MobileMenu>
                )}
            </AnimatePresence>
        </HeaderWrapper>
    );
}

export default Header;
