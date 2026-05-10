import type { Metadata } from 'next';

import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'NEO_LEDGER // AI EXPENSE TRACKER',
  description: 'AI-powered expense tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full bg-[#050505] text-white font-mono">
        {children}
      </body>
    </html>
  );
}
