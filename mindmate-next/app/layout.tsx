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
  openGraph: {
    title: "MindMate - Your Mental Wellness Companion",
    description: "AI-powered mental health support for students",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '72px' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
