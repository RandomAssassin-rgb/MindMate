'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const getVariantStyles = (variant: string) => {
  const variants: Record<string, any> = {
    primary: {
      background: 'linear-gradient(135deg, #FF6A09, #E85E00)',
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 4px 14px rgba(255,106,9,0.35)',
      hover: {
        background: 'linear-gradient(135deg, #E85E00, #D45500)',
        boxShadow: '0 8px 24px rgba(255,106,9,0.45)',
      }
    },
    secondary: {
      background: '#FFF7F2',
      color: '#FF6A09',
      border: '2px solid #FF6A0920',
      boxShadow: 'none',
      hover: {
        background: '#FFEEE4',
        borderColor: '#FF6A0940',
      }
    },
    outline: {
      background: 'transparent',
      color: '#374151',
      border: '2px solid rgba(17,24,39,0.15)',
      boxShadow: 'none',
      hover: {
        background: 'rgba(17,24,39,0.04)',
        borderColor: 'rgba(17,24,39,0.25)',
      }
    },
    ghost: {
      background: 'transparent',
      color: '#374151',
      border: 'none',
      boxShadow: 'none',
      hover: {
        background: 'rgba(17,24,39,0.06)',
      }
    },
    danger: {
      background: '#EF4444',
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
      hover: {
        background: '#DC2626',
        boxShadow: '0 8px 24px rgba(239,68,68,0.45)',
      }
    }
  };
  return variants[variant] || variants.primary;
};

const getSizeStyles = (size: string) => {
  const sizes: Record<string, any> = {
    sm: {
      padding: '8px 18px',
      fontSize: '14px',
      height: '36px',
      iconSize: 16,
    },
    md: {
      padding: '12px 24px',
      fontSize: '15px',
      height: '44px',
      iconSize: 18,
    },
    lg: {
      padding: '16px 32px',
      fontSize: '16px',
      height: '52px',
      iconSize: 20,
    }
  };
  return sizes[size] || sizes.md;
};

const ButtonRoot = styled(motion.button) <{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
  $loading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  border-radius: 999px;
  cursor: ${({ $loading, disabled }) => ($loading || disabled) ? 'not-allowed' : 'pointer'};
  opacity: ${({ $loading, disabled }) => ($loading || disabled) ? 0.6 : 1};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  white-space: nowrap;
  transition: all 180ms cubic-bezier(.2,.9,.2,1);
  
  ${({ $variant }) => {
    const styles = getVariantStyles($variant);
    return `
      background: ${styles.background};
      color: ${styles.color};
      border: ${styles.border};
      box-shadow: ${styles.boxShadow};
    `;
  }}
  
  ${({ $size }) => {
    const styles = getSizeStyles($size);
    return `
      padding: ${styles.padding};
      font-size: ${styles.fontSize};
      min-height: ${styles.height};
    `;
  }}
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    ${({ $variant }) => {
    const styles = getVariantStyles($variant);
    return `
        background: ${styles.hover?.background || styles.background};
        box-shadow: ${styles.hover?.boxShadow || styles.boxShadow};
        border-color: ${styles.hover?.borderColor || 'inherit'};
      `;
  }}
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:focus-visible {
    outline: 3px solid #FF6A09;
    outline-offset: 2px;
  }
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const IconWrapper = styled.span<{ $size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) {
    const sizeStyles = getSizeStyles(size);

    return (
      <ButtonRoot
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $loading={loading}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon && (
              <IconWrapper $size={sizeStyles.iconSize}>
                {leftIcon}
              </IconWrapper>
            )}
            {children}
            {rightIcon && (
              <IconWrapper $size={sizeStyles.iconSize}>
                {rightIcon}
              </IconWrapper>
            )}
          </>
        )}
      </ButtonRoot>
    );
  }
);

export default Button;
