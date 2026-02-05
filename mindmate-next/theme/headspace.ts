// Headspace-inspired Emotion Theme for MindMate
// Professional warm color palette with generous spacing

export const headspaceTheme = {
    colors: {
        // Primary brand colors
        primary: '#FF6A00',        // Warm coral/orange (CTA)
        primaryDark: '#E65C00',    // Darker for hover
        primaryLight: '#FFF0E6',   // Light tint for backgrounds

        // Accent colors
        accent: '#FFD166',         // Warm yellow highlight
        accentBlue: '#3B82F6',     // Trust blue for info
        accentGreen: '#22C55E',    // Success/calm green
        accentPurple: '#8B5CF6',   // Premium purple

        // Backgrounds
        bg: '#FFFBF7',             // Warm cream background
        bgSecondary: '#FFF7F2',    // Slightly warmer
        bgWarm: '#FEF3E8',         // Card backgrounds
        surface: '#FFFFFF',        // Pure white cards

        // Text
        text: '#1F2937',           // Dark charcoal
        textSecondary: '#4B5563',  // Muted text
        muted: '#9CA3AF',          // Placeholder/hints

        // Borders & Dividers
        border: '#E5E7EB',
        borderHover: '#D1D5DB',

        // Semantic
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
    },

    // Generous spacing for premium feel
    spacing: {
        xs: '6px',
        sm: '12px',
        md: '20px',
        lg: '32px',
        xl: '48px',
        xxl: '64px',
        section: '80px'
    },

    // Rounded, friendly radii
    radii: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '28px',
        pill: '100px',
        circle: '50%'
    },

    // Soft, subtle shadows
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 12px 40px rgba(0, 0, 0, 0.12)',
        xl: '0 24px 60px rgba(0, 0, 0, 0.15)',
        glow: '0 4px 20px rgba(255, 106, 0, 0.25)',
        card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)'
    },

    // Premium typography
    typography: {
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontFamilyDisplay: "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",

        // Font sizes
        h1: '48px',
        h2: '36px',
        h3: '24px',
        h4: '20px',
        body: '16px',
        small: '14px',
        xs: '12px',

        // Font weights
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,

        // Line heights
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75
    },

    // Animation timing
    motion: {
        fast: '120ms',
        normal: '200ms',
        slow: '350ms',
        easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },

    // Breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1440px'
    },

    // Layout
    layout: {
        maxWidth: '1400px',
        headerHeight: '80px',
        sidebarWidth: '280px'
    }
} as const;

// Type for theme
export type Theme = typeof headspaceTheme;
