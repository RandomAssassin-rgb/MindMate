import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/layout/Footer";


const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "MindMate - Your Mental Wellness Companion",
  description: "AI-powered mental health support for students. Track your mood, chat with our AI counselor, take assessments, and connect with professionals.",
  keywords: ["mental health", "wellness", "AI counselor", "mood tracking", "meditation", "student health"],
  authors: [{ name: "MindMate Team" }],
  manifest: "/manifest.json",
  themeColor: "#8B5CF6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MindMate",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: "MindMate - Your Mental Wellness Companion",
    description: "AI-powered mental health support for students",
    type: "website",
  }
};

import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <ErrorBoundary>
          <Providers>
            <Header />
            <main id="main-content" role="main" aria-label="Main content" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '72px' }}>
              {children}
            </main>
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
