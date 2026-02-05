// MindMate Logo Component
// Friendly brain/chat bubble concept with warm coral color

import React from 'react';

interface LogoProps {
    size?: 'small' | 'medium' | 'large' | number;
    variant?: 'color' | 'white' | 'dark';
    showText?: boolean;
    className?: string;
}

const sizeMap = {
    small: 32,
    medium: 40,
    large: 88,
};

export function MindMateLogo({
    size = 'medium',
    variant = 'color',
    showText = false,
    className
}: LogoProps) {
    const pixelSize = typeof size === 'number' ? size : sizeMap[size];

    const colors = {
        color: { bg: '#FF6A09', accent: '#FFD36A', stroke: '#FFFFFF' },
        white: { bg: '#FFFFFF', accent: '#FFFFFF', stroke: '#FF6A09' },
        dark: { bg: '#111827', accent: '#374151', stroke: '#FFFFFF' },
    };

    const { bg, accent, stroke } = colors[variant];

    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: showText ? 12 : 0
            }}
        >
            <svg
                width={pixelSize}
                height={pixelSize}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                style={{ flexShrink: 0 }}
            >
                {/* Rounded square background */}
                <rect x="0" y="0" width="48" height="48" rx="12" fill={bg} />

                {/* Brain wave / smile curve - friendly, supportive */}
                <path
                    d="M14 28c4-6 12-6 16 0"
                    fill="none"
                    stroke={stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Upper wave - represents thoughts/mind */}
                <path
                    d="M18 19c2-4 8-4 10 0"
                    fill="none"
                    stroke={stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Small dot - mindful presence */}
                <circle cx="24" cy="13" r="2" fill={stroke} />
            </svg>

            {showText && (
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: pixelSize * 0.45,
                        color: variant === 'white' ? '#FFFFFF' : '#111827',
                        letterSpacing: '-0.02em',
                    }}
                >
                    MindMate
                </span>
            )}
        </div>
    );
}

// Static SVG for direct use
export const MindMateLogoSVG = `
<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
  <rect x="0" y="0" width="48" height="48" rx="12" fill="#FF6A09"/>
  <path d="M14 28c4-6 12-6 16 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 19c2-4 8-4 10 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="13" r="2" fill="#fff"/>
</svg>
`;

export default MindMateLogo;
