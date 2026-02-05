// src/theme/mindmateTheme.ts
// Exact design tokens from the MindMate Design Document
// Premium Headspace-inspired theme with warm coral accents

export const mindmate = {
    colors: {
        // Core backgrounds
        bg: '#FFF7F2',              // warm cream page bg
        bgSecondary: '#FFF0E8',     // slightly warmer for sections
        surface: '#FFFFFF',         // cards, modals
        surfaceHover: '#FFFAF8',    // subtle hover state

        // Brand colors
        primary: '#FF6A09',         // warm coral/orange CTA
        primaryHover: '#E85E00',    // darker primary for hover
        primaryLight: 'rgba(255,106,9,0.12)', // for badges/chips
        accent: '#FFD36A',          // soft yellow highlight
        accentLight: 'rgba(255,211,106,0.2)',
        secondary: '#7AD7C7',       // teal accent for variety

        // Text hierarchy
        text: '#111827',            // heading text (dark neutral)
        textSecondary: '#374151',   // subheadings
        muted: '#6B6F76',           // body text
        subtle: '#9CA3AF',          // metadata, captions

        // Semantic colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Shadows & overlays
        shadowTint: 'rgba(17,24,39,0.06)',
        overlay: 'rgba(17,24,39,0.4)',

        // Border colors
        border: 'rgba(17,24,39,0.08)',
        borderHover: 'rgba(17,24,39,0.15)',
    },

    radii: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px',
        full: '50%',
    },

    spacing: {
        xs: 6,
        sm: 12,
        md: 20,
        lg: 32,
        xl: 48,
        xxl: 80,
        section: 120,  // section vertical padding
    },

    shadows: {
        soft: '0 8px 22px rgba(17,24,39,0.06)',
        medium: '0 12px 32px rgba(17,24,39,0.1)',
        strong: '0 20px 48px rgba(17,24,39,0.15)',
        card: '0 4px 16px rgba(17,24,39,0.04)',
        cardHover: '0 16px 40px rgba(17,24,39,0.12)',
        button: '0 4px 14px rgba(255,106,9,0.35)',
        buttonHover: '0 8px 24px rgba(255,106,9,0.45)',
    },

    typography: {
        family: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        familyDisplay: "'Outfit', 'Inter', system-ui, sans-serif",

        // Font sizes
        h1: '40px',
        h2: '28px',
        h3: '20px',
        h4: '18px',
        body: '16px',
        small: '14px',
        caption: '12px',

        // Line heights
        lineHeightTight: 1.2,
        lineHeightNormal: 1.5,
        lineHeightRelaxed: 1.7,

        // Font weights
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    motion: {
        // Easing curves
        easeOut: 'cubic-bezier(.2,.9,.2,1)',
        easeInOut: 'cubic-bezier(.4,0,.2,1)',
        spring: 'cubic-bezier(.34,1.56,.64,1)',

        // Duration presets
        instant: '80ms',
        quick: '120ms',
        normal: '240ms',
        slow: '400ms',

        // Full timing strings
        quickEase: '120ms cubic-bezier(.2,.9,.2,1)',
        normalEase: '240ms cubic-bezier(.2,.9,.2,1)',
        slowEase: '400ms cubic-bezier(.2,.9,.2,1)',
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1536px',
    },

    layout: {
        maxWidth: '1280px',
        headerHeight: '72px',
        playerHeight: '80px',
        mobilePlayerHeight: '64px',
        cardWidth: '300px',
        cardAspectRatio: 1.3,
        minTouchTarget: '44px',
    },

    zIndex: {
        base: 0,
        dropdown: 100,
        sticky: 200,
        modal: 300,
        toast: 400,
        player: 500,
    },
} as const;

// Type export for Emotion
export type MindMateTheme = typeof mindmate;
