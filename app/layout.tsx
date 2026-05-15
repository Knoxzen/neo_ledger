import type { Metadata, Viewport } from 'next';

import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'NEO_LEDGER // AI EXPENSE TRACKER',
  description: 'AI-powered expense tracker',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

import { Toaster } from 'sonner';
import { TerminalDataProvider } from '@/src/context/TerminalDataContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full bg-[#050505] text-white font-mono">
        <TerminalDataProvider>
          {children}
        </TerminalDataProvider>
        <Toaster theme="dark" position="bottom-right" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </body>
    </html>
  );
}
