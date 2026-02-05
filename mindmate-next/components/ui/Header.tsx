'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, User, ChevronDown, MessageCircle, Activity, Heart, BookOpen, Video, ClipboardCheck, Brain, ArrowRight } from 'lucide-react';
import { MindMateLogo } from './Logo';
import { Button } from './Button';
import { supabase } from '@/lib/supabase';

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
`;

const HeaderRoot = styled(motion.header) <{ scrolled: boolean; dropdownOpen: boolean }>`
  background: ${({ scrolled, dropdownOpen }) =>
    dropdownOpen ? 'white' : (scrolled ? 'rgba(255,255,255,0.98)' : 'white')};
  backdrop-filter: ${({ scrolled }) => scrolled ? 'blur(16px)' : 'none'};
  box-shadow: ${({ scrolled, dropdownOpen }) =>
    dropdownOpen ? 'none' : (scrolled ? '0 2px 12px rgba(17,24,39,0.04)' : 'none')};
  transition: all 280ms cubic-bezier(.2,.9,.2,1);
  border-bottom: 4px solid #F9BE00;
`;

const HeaderInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 48px;
  display: flex;
  align-items: center;
  gap: 48px;
  
  @media (max-width: 768px) {
    padding: 18px 24px;
    gap: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 24px;
  color: #1B1B1B;
  letter-spacing: -0.02em;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItemTrigger = styled.button<{ isOpen?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #1B1B1B;
  padding: 12px 16px;
  transition: all 150ms;
  position: relative;
  text-decoration: ${props => props.isOpen ? 'underline' : 'none'};
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
  
  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }
`;

const NavLink = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  color: #1B1B1B;
  text-decoration: none;
  padding: 12px 16px;
  transition: all 150ms;
  
  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }
`;

// Full-Width Mega Menu
const MegaMenuWrapper = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  z-index: 100;
`;

const MegaMenuInner = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 48px 64px;
  display: grid;
  grid-template-columns: repeat(4, 1fr) 280px;
  gap: 48px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr) 250px;
    gap: 32px;
  }
`;

const MenuColumn = styled.div``;

const MenuColumnTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
`;

const MenuLink = styled(Link)`
  display: block;
  font-size: 16px;
  color: #6B7280;
  text-decoration: none;
  padding: 8px 0;
  transition: color 150ms;
  
  &:hover {
    color: #3B82F6;
  }
`;

// Featured Card
const FeaturedCard = styled.div`
  background: #FEF7F0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const FeaturedImageArea = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #FFD166, #FF9F1C);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #22C55E;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
`;

const FeaturedContent = styled.div`
  padding: 20px;
`;

const FeaturedCTA = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  
  svg {
    transition: transform 150ms;
  }
  
  &:hover {
    color: #3B82F6;
    
    svg {
      transform: translateX(4px);
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
`;

const ActionLink = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  color: #1B1B1B;
  text-decoration: none;
  padding: 8px 12px;
  transition: all 150ms;
  
  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const TryFreeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #3478F6;
  border-radius: 100px;
  text-decoration: none;
  transition: all 180ms;
  white-space: nowrap;
  
  &:hover {
    background: #2563EB;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 120, 246, 0.3);
  }
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6A09, #FFD36A);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 180ms;
  
  &:hover {
    transform: scale(1.05);
  }
  
  svg {
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #111827;
  
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  max-width: 90vw;
  background: #FFFFFF;
  box-shadow: -8px 0 40px rgba(0,0,0,0.15);
  z-index: 300;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 299;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const MobileNavSection = styled.div`
  margin-bottom: 24px;
`;

const MobileSectionTitle = styled.h4`
  font-size: 11px;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-left: 16px;
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  text-decoration: none;
  margin-bottom: 4px;
  transition: all 180ms;
  
  &:hover, &.active {
    background: rgba(255,106,9,0.08);
    color: #FF6A09;
  }
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Dropdown Data - Mimicking Headspace structure
const dropdownData = {
  relax: {
    columns: [
      {
        title: 'What we offer',
        links: [
          { label: 'Meditation', href: '/relax' },
          { label: 'Sleep stories', href: '/relax?category=sleep' },
          { label: 'Breathing exercises', href: '/relax?category=breathing' },
          { label: 'Soundscapes', href: '/relax?category=sounds' },
          { label: 'Focus music', href: '/relax?category=focus' },
        ]
      },
      {
        title: 'How we help',
        links: [
          { label: 'Anxiety', href: '/relax?tag=anxiety' },
          { label: 'Stress', href: '/relax?tag=stress' },
          { label: 'Sleep better', href: '/relax?tag=sleep' },
          { label: 'Focus', href: '/relax?tag=focus' },
          { label: 'Self-esteem', href: '/relax?tag=self-esteem' },
        ]
      },
      {
        title: 'Explore library',
        links: [
          { label: 'New and popular', href: '/relax?sort=popular' },
          { label: 'Quick sessions', href: '/relax?duration=5' },
          { label: 'Deep relaxation', href: '/relax?duration=20' },
          { label: 'Body scan', href: '/relax?category=body-scan' },
          { label: 'View all', href: '/relax' },
        ]
      },
      {
        title: 'Featured',
        links: [
          { label: 'Morning calm', href: '/relax?featured=morning' },
          { label: 'Evening wind-down', href: '/relax?featured=evening' },
          { label: 'Mindful moments', href: '/relax?featured=mindful' },
        ]
      }
    ],
    featured: {
      badge: 'New',
      image: Heart,
      title: 'Sleep better tonight',
      href: '/relax?category=sleep'
    }
  },
  learn: {
    columns: [
      {
        title: 'Self-help tools',
        links: [
          { label: 'CBT techniques', href: '/learn/cbt' },
          { label: 'Journaling', href: '/learn/journaling' },
          { label: 'Thought reframing', href: '/learn/cbt#reframing' },
          { label: 'Coping strategies', href: '/learn/coping' },
          { label: 'Mindfulness basics', href: '/learn/mindfulness' },
        ]
      },
      {
        title: 'Mental health',
        links: [
          { label: 'Understanding anxiety', href: '/learn?topic=anxiety' },
          { label: 'Managing depression', href: '/learn?topic=depression' },
          { label: 'Stress relief', href: '/learn?topic=stress' },
          { label: 'Building resilience', href: '/learn?topic=resilience' },
          { label: 'Healthy habits', href: '/learn?topic=habits' },
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'Safety planning', href: '/learn/safety' },
          { label: 'Crisis support', href: '/crisis' },
          { label: 'Finding a therapist', href: '/learn/find-therapist' },
          { label: 'Support groups', href: '/learn/groups' },
          { label: 'View all', href: '/learn' },
        ]
      },
      {
        title: 'Popular guides',
        links: [
          { label: 'Beginner meditation', href: '/learn/meditation-101' },
          { label: 'Better sleep guide', href: '/learn/sleep-guide' },
          { label: 'Anxiety workbook', href: '/learn/anxiety-workbook' },
        ]
      }
    ],
    featured: {
      badge: 'Popular',
      image: BookOpen,
      title: 'Start your wellness journey',
      href: '/learn'
    }
  },
  support: {
    columns: [
      {
        title: 'AI support',
        links: [
          { label: 'Chat with AI', href: '/chat' },
          { label: 'Mood tracking', href: '/mood' },
          { label: 'Daily check-ins', href: '/mood' },
          { label: 'Personalized tips', href: '/insights' },
          { label: 'Ebb companion', href: '/chat' },
        ]
      },
      {
        title: 'Professional help',
        links: [
          { label: 'Video consultations', href: '/video' },
          { label: 'Book a session', href: '/video/book' },
          { label: 'Meet our counselors', href: '/counselors' },
          { label: 'Insurance info', href: '/insurance' },
          { label: 'Corporate plans', href: '/enterprise' },
        ]
      },
      {
        title: 'Track progress',
        links: [
          { label: 'Mood history', href: '/mood/history' },
          { label: 'Weekly insights', href: '/insights' },
          { label: 'Goals & streaks', href: '/goals' },
          { label: 'Achievements', href: '/achievements' },
          { label: 'View all', href: '/dashboard' },
        ]
      },
      {
        title: 'Get started',
        links: [
          { label: 'Take assessment', href: '/assessments' },
          { label: 'Recommended for you', href: '/recommended' },
          { label: 'Quick start guide', href: '/guide' },
        ]
      }
    ],
    featured: {
      badge: '24/7',
      image: MessageCircle,
      title: 'Get support anytime',
      href: '/chat'
    }
  }
};

type DropdownKey = 'relax' | 'learn' | 'support';

const navItems: { label: string; key: DropdownKey }[] = [
  { label: 'Relax', key: 'relax' },
  { label: 'Learn', key: 'learn' },
  { label: 'Support', key: 'support' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
  const [user, setUser] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMouseEnter = (key: DropdownKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <HeaderWrapper
        onMouseLeave={handleMouseLeave}
      >
        <HeaderRoot scrolled={scrolled} dropdownOpen={!!activeDropdown}>
          <HeaderInner>
            <LeftSection>
              <LogoLink href="/">
                <MindMateLogo size="medium" />
                <LogoText>MindMate</LogoText>
              </LogoLink>

              <Nav>
                {navItems.map(item => (
                  <NavItemTrigger
                    key={item.key}
                    isOpen={activeDropdown === item.key}
                    onMouseEnter={() => handleMouseEnter(item.key)}
                  >
                    {item.label}
                  </NavItemTrigger>
                ))}
                <NavLink href="/mood">Mood</NavLink>
                <NavLink href="/community">Community</NavLink>
                <NavLink href="/video">Video Consult</NavLink>
              </Nav>
            </LeftSection>

            <Actions>
              {user ? (
                <div style={{ position: 'relative' }}>
                  <Button
                    variant="ghost"
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#FF6A09',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>My Profile</span>
                    <ChevronDown size={16} />
                  </Button>

                  {profileOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 8,
                      background: 'white',
                      borderRadius: 12,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      border: '1px solid #eee',
                      width: 200,
                      overflow: 'hidden',
                      padding: 4
                    }}>
                      <Link href="/profile" style={{
                        display: 'block',
                        padding: '10px 12px',
                        fontSize: 14,
                        color: '#333',
                        textDecoration: 'none',
                        borderRadius: 8,
                        transition: 'background 0.2s',
                      }} onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        View Profile
                      </Link>
                      <button onClick={handleSignOut} style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        fontSize: 14,
                        color: '#d93025',
                        background: 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }} onMouseOver={e => e.currentTarget.style.background = '#fff5f5'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <ActionLink href="/login">Log in</ActionLink>
                  <ActionLink href="/help">Help</ActionLink>
                  <TryFreeButton href="/signup">
                    Try for free
                  </TryFreeButton>
                </>
              )}
              <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
              </MobileMenuButton>
            </Actions>
          </HeaderInner>
        </HeaderRoot>

        <AnimatePresence>
          {activeDropdown && (
            <MegaMenuWrapper
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <MegaMenuInner>
                {dropdownData[activeDropdown].columns.map((col, idx) => (
                  <MenuColumn key={idx}>
                    <MenuColumnTitle>{col.title}</MenuColumnTitle>
                    {col.links.map(link => (
                      <MenuLink key={link.href} href={link.href}>
                        {link.label}
                      </MenuLink>
                    ))}
                  </MenuColumn>
                ))}

                <FeaturedCard>
                  <FeaturedImageArea>
                    <FeaturedBadge>{dropdownData[activeDropdown].featured.badge}</FeaturedBadge>
                    {(() => {
                      const IconComp = dropdownData[activeDropdown].featured.image;
                      return <IconComp size={48} color="white" />;
                    })()}
                  </FeaturedImageArea>
                  <FeaturedContent>
                    <FeaturedCTA href={dropdownData[activeDropdown].featured.href}>
                      {dropdownData[activeDropdown].featured.title}
                      <ArrowRight size={16} />
                    </FeaturedCTA>
                  </FeaturedContent>
                </FeaturedCard>
              </MegaMenuInner>
            </MegaMenuWrapper>
          )}
        </AnimatePresence>
      </HeaderWrapper>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <MobileMenuOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileMenu
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <MobileMenuHeader>
                <MindMateLogo size="medium" showText />
                <CloseButton onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} />
                </CloseButton>
              </MobileMenuHeader>

              <MobileNavSection>
                <MobileSectionTitle>Wellness</MobileSectionTitle>
                <MobileNavLink href="/relax" onClick={() => setMobileMenuOpen(false)}>
                  <Heart size={18} /> Relax & Meditate
                </MobileNavLink>
                <MobileNavLink href="/learn" onClick={() => setMobileMenuOpen(false)}>
                  <BookOpen size={18} /> Learn & Grow
                </MobileNavLink>
              </MobileNavSection>

              <MobileNavSection>
                <MobileSectionTitle>Support</MobileSectionTitle>
                <MobileNavLink href="/chat" onClick={() => setMobileMenuOpen(false)}>
                  <MessageCircle size={18} /> AI Chat
                </MobileNavLink>
                <MobileNavLink href="/mood" onClick={() => setMobileMenuOpen(false)}>
                  <Activity size={18} /> Mood Tracking
                </MobileNavLink>
                <MobileNavLink href="/video" onClick={() => setMobileMenuOpen(false)}>
                  <Video size={18} /> Video Consult
                </MobileNavLink>
              </MobileNavSection>

              <MobileNavSection>
                <MobileSectionTitle>Tools</MobileSectionTitle>
                <MobileNavLink href="/assessments" onClick={() => setMobileMenuOpen(false)}>
                  <ClipboardCheck size={18} /> Assessments
                </MobileNavLink>
                <MobileNavLink href="/learn/safety" onClick={() => setMobileMenuOpen(false)}>
                  <Brain size={18} /> Safety Planning
                </MobileNavLink>
              </MobileNavSection>

              <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                {user ? (
                  <Button variant="outline" fullWidth onClick={handleSignOut}>
                    Log Out
                  </Button>
                ) : (
                  <>
                    <Link href="/signup" style={{ width: '100%', display: 'block' }}>
                      <Button fullWidth style={{ marginBottom: 12 }}>
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/login" style={{ width: '100%', display: 'block' }}>
                      <Button variant="outline" fullWidth>
                        Log in
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
