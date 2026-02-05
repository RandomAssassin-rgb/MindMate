'use client';

import styled from '@emotion/styled';
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'warm';
    padding?: 'sm' | 'md' | 'lg';
    clickable?: boolean;
    fullHeight?: boolean;
}

const StyledCard = styled(motion.div) <{
    variant: string;
    padding: string;
    clickable: boolean;
    fullHeight: boolean;
}>`
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.motion.normal} ${({ theme }) => theme.motion.easeOut};
  height: ${({ fullHeight }) => (fullHeight ? '100%' : 'auto')};

  ${({ clickable }) =>
        clickable &&
        `
    cursor: pointer;
    user-select: none;
  `}

  /* Padding variants */
  ${({ padding, theme }) => {
        switch (padding) {
            case 'sm':
                return `padding: ${theme.spacing.sm};`;
            case 'lg':
                return `padding: ${theme.spacing.lg};`;
            default:
                return `padding: ${theme.spacing.md};`;
        }
    }}

  /* Card variants */
  ${({ variant, theme, clickable }) => {
        switch (variant) {
            case 'elevated':
                return `
          background: ${theme.colors.surface};
          box-shadow: ${theme.shadows.card};
          
          ${clickable ? `
            &:hover {
              transform: translateY(-6px);
              box-shadow: ${theme.shadows.lg};
            }
          ` : ''}
        `;
            case 'outlined':
                return `
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          
          ${clickable ? `
            &:hover {
              border-color: ${theme.colors.primary};
              box-shadow: ${theme.shadows.sm};
            }
          ` : ''}
        `;
            case 'warm':
                return `
          background: ${theme.colors.bgWarm};
          border: 1px solid ${theme.colors.border};
          
          ${clickable ? `
            &:hover {
              background: ${theme.colors.primaryLight};
              border-color: ${theme.colors.primary};
            }
          ` : ''}
        `;
            default:
                return `
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          
          ${clickable ? `
            &:hover {
              border-color: ${theme.colors.borderHover};
              box-shadow: ${theme.shadows.sm};
            }
          ` : ''}
        `;
        }
    }}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            variant = 'default',
            padding = 'md',
            clickable = false,
            fullHeight = false,
            onClick,
            ...props
        },
        ref
    ) => {
        return (
            <StyledCard
                ref={ref}
                variant={variant}
                padding={padding}
                clickable={clickable || !!onClick}
                fullHeight={fullHeight}
                onClick={onClick}
                whileTap={clickable ? { scale: 0.98 } : undefined}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                {...props}
            >
                {children}
            </StyledCard>
        );
    }
);

Card.displayName = 'Card';

// Card sub-components for composition
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h4};
  font-weight: ${({ theme }) => theme.typography.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.relaxed};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardImage = styled.div<{ src: string; height?: string }>`
  width: 100%;
  height: ${({ height }) => height || '160px'};
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default Card;
