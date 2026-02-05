'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRef, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

interface CarouselProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

const CarouselRoot = styled.div`
  width: 100%;
`;

const CarouselHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CarouselTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const CarouselNav = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled.button<{ direction: 'left' | 'right' }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(17,24,39,0.1);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 180ms cubic-bezier(.2,.9,.2,1);
  color: #374151;
  
  &:hover {
    background: #FF6A09;
    color: white;
    border-color: #FF6A09;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      background: white;
      color: #374151;
      border-color: rgba(17,24,39,0.1);
      transform: none;
    }
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16px;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Allow items to peek */
  &::after {
    content: '';
    flex-shrink: 0;
    width: 1px;
  }
`;

const CarouselItem = styled(motion.div)`
  flex: 0 0 auto;
  width: 300px;
  scroll-snap-align: start;
  
  @media (max-width: 640px) {
    width: 280px;
  }
`;

export function Carousel({ children, title, className }: CarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement[]>([]);

    const scrollBy = (direction: 'left' | 'right') => {
        if (!trackRef.current) return;
        const scrollAmount = 324; // card width + gap
        trackRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    // GSAP stagger animation on mount
    useEffect(() => {
        if (itemsRef.current.length > 0) {
            gsap.fromTo(
                itemsRef.current,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: 'power2.out',
                }
            );
        }
    }, []);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.06,
                duration: 0.4,
                ease: [0.2, 0.9, 0.2, 1]
            }
        })
    };

    return (
        <CarouselRoot className={className}>
            {title && (
                <CarouselHeader>
                    <CarouselTitle>{title}</CarouselTitle>
                    <CarouselNav>
                        <NavButton direction="left" onClick={() => scrollBy('left')}>
                            <ChevronLeft size={20} />
                        </NavButton>
                        <NavButton direction="right" onClick={() => scrollBy('right')}>
                            <ChevronRight size={20} />
                        </NavButton>
                    </CarouselNav>
                </CarouselHeader>
            )}

            <CarouselTrack ref={trackRef}>
                {Array.isArray(children) ? (
                    children.map((child, i) => (
                        <CarouselItem
                            key={i}
                            ref={(el) => { if (el) itemsRef.current[i] = el; }}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                        >
                            {child}
                        </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>{children}</CarouselItem>
                )}
            </CarouselTrack>
        </CarouselRoot>
    );
}

export default Carousel;
