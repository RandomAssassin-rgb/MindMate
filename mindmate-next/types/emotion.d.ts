import '@emotion/react';

// Define the complete Theme interface explicitly
declare module '@emotion/react' {
    export interface Theme {
        colors: {
            bg: string;
            bgSecondary: string;
            surface: string;
            surfaceHover: string;
            primary: string;
            primaryHover: string;
            primaryLight: string;
            accent: string;
            accentLight: string;
            secondary: string;
            text: string;
            textSecondary: string;
            muted: string;
            subtle: string;
            success: string;
            warning: string;
            error: string;
            info: string;
            shadowTint: string;
            overlay: string;
            border: string;
            borderHover: string;
        };
        radii: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            pill: string;
            full: string;
        };
        spacing: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
            section: number;
        };
        shadows: {
            soft: string;
            medium: string;
            strong: string;
            card: string;
            cardHover: string;
            button: string;
            buttonHover: string;
        };
        typography: {
            family: string;
            familyDisplay: string;
            h1: string;
            h2: string;
            h3: string;
            h4: string;
            body: string;
            small: string;
            caption: string;
            lineHeightTight: number;
            lineHeightNormal: number;
            lineHeightRelaxed: number;
            regular: number;
            medium: number;
            semibold: number;
            bold: number;
        };
        motion: {
            easeOut: string;
            easeInOut: string;
            spring: string;
            instant: string;
            quick: string;
            normal: string;
            slow: string;
            quickEase: string;
            normalEase: string;
            slowEase: string;
            fast?: string;
        };
        breakpoints: {
            sm: string;
            md: string;
            lg: string;
            xl: string;
            xxl: string;
        };
        layout: {
            maxWidth: string;
            headerHeight: string;
            playerHeight: string;
            mobilePlayerHeight: string;
            cardWidth: string;
            cardAspectRatio: number;
            minTouchTarget: string;
        };
        zIndex: {
            base: number;
            dropdown: number;
            sticky: number;
            modal: number;
            toast: number;
            player: number;
        };
    }
}
