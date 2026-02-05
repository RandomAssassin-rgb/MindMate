'use client';

import { ThemeProvider, Global, css } from '@emotion/react';
import { mindmate } from '@/theme/mindmateTheme';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: ${mindmate.typography.family};
    font-size: ${mindmate.typography.body};
    line-height: ${mindmate.typography.lineHeightNormal};
    color: ${mindmate.colors.text};
    background: ${mindmate.colors.bg};
    min-height: 100vh;
  }
  
  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Focus styles for accessibility */
  :focus-visible {
    outline: 3px solid ${mindmate.colors.primary};
    outline-offset: 2px;
  }
  
  :focus:not(:focus-visible) {
    outline: none;
  }
  
  /* Interactive base styles */
  button, a {
    font-family: inherit;
    cursor: pointer;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  img, svg {
    display: block;
    max-width: 100%;
  }
  
  /* Selection color */
  ::selection {
    background: ${mindmate.colors.primary}30;
    color: ${mindmate.colors.text};
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${mindmate.colors.bg};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${mindmate.colors.border};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${mindmate.colors.borderHover};
  }
  
  /* Utility classes */
  .interactive {
    transition: transform 180ms ${mindmate.motion.easeOut}, 
                box-shadow 180ms ${mindmate.motion.easeOut};
  }
  
  .interactive:hover {
    transform: translateY(-4px);
  }
  
  .interactive:active {
    transform: scale(0.98);
  }
`;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={mindmate}>
      <Global styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
}

export default Providers;
