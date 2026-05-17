'use client';

import { SessionProvider } from "next-auth/react";
import { TerminalDataProvider } from "@/src/context/TerminalDataContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={24 * 60 * 60}>
      <TerminalDataProvider>
        {children}
      </TerminalDataProvider>
      <Toaster theme="dark" position="bottom-right" />
    </SessionProvider>
  );
}
