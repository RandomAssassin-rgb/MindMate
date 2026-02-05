'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { forwardRef } from 'react';

interface ContentCardProps {
    title: string;
    subtitle?: string;
    thumbnail: string;
    duration?: string;
    category?: string;
    onClick?: () => void;
    className?: string;
}

const CardRoot = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(17,24,39,0.04);
  cursor: pointer;
  transition: transform 240ms cubic-bezier(.2,.9,.2,1), 
              box-shadow 240ms cubic-bezier(.2,.9,.2,1);
  
  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 16px 40px rgba(17,24,39,0.12);
  }
  
  &:active {
    transform: translateY(-2px) scale(0.99);
  }
  
  &:focus-visible {
    outline: 3px solid #FF6A09;
    outline-offset: 2px;
  }
`;

const CardThumbnail = styled.div<{ src: string }>`
  width: 100%;
  aspect-ratio: 1.3;
  background: url(${({ src }) => src}) center/cover;
  position: relative;
`;

const DurationBadge = styled.span`
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255,211,106,0.95);
  color: #92400E;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 14px;
  background: rgba(255,255,255,0.95);
  color: #FF6A09;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
`;

const CardBody = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  line-height: 1.3;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: #6B6F76;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
    function ContentCard(
        { title, subtitle, thumbnail, duration, category, onClick, className },
        ref
    ) {
        return (
            <CardRoot
                ref={ref}
                className={className}
                onClick={onClick}
                role="button"
                tabIndex={0}
                aria-label={title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick?.();
                    }
                }}
            >
                <CardThumbnail src={thumbnail}>
                    {category && <CategoryBadge>{category}</CategoryBadge>}
                    {duration && (
                        <DurationBadge>
                            <Clock />
                            {duration}
                        </DurationBadge>
                    )}
                </CardThumbnail>
                <CardBody>
                    <CardTitle>{title}</CardTitle>
                    {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
                </CardBody>
            </CardRoot>
        );
    }
);

// Skeleton loader for cards
const SkeletonRoot = styled.div`
  background: #FFFFFF;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(17,24,39,0.04);
`;

const SkeletonThumb = styled.div`
  width: 100%;
  aspect-ratio: 1.3;
  background: linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonBody = styled.div`
  padding: 20px;
`;

const SkeletonLine = styled.div<{ width?: string }>`
  height: 16px;
  background: linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  width: ${({ width }) => width || '100%'};
  margin-bottom: 8px;
`;

export function ContentCardSkeleton() {
    return (
        <SkeletonRoot>
            <SkeletonThumb />
            <SkeletonBody>
                <SkeletonLine width="80%" />
                <SkeletonLine width="60%" />
            </SkeletonBody>
        </SkeletonRoot>
    );
}

export default ContentCard;
