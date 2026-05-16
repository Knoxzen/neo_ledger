'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Database, Cloud } from 'lucide-react';

export function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] p-6 text-white font-mono">
      <div className="w-full max-w-md border-2 border-white bg-black p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">NEO_LEDGER</h1>
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            Privacy-First AI Expense Tracker
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-start gap-4 text-left">
            <ShieldCheck className="size-5 text-[#BBFF00] shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed text-white/60 uppercase">
              <span className="text-white font-bold">LOCAL-FIRST:</span> YOUR FINANCIAL DATA NEVER LEAVES YOUR DEVICE UNENCRYPTED.
            </p>
          </div>
          <div className="flex items-start gap-4 text-left">
            <Database className="size-5 text-[#FF00FF] shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed text-white/60 uppercase">
              <span className="text-white font-bold">ZERO BACKEND:</span> WE DO NOT STORE YOUR TRANSACTIONS ON OUR SERVERS.
            </p>
          </div>
          <div className="flex items-start gap-4 text-left">
            <Cloud className="size-5 text-[#00FFFF] shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed text-white/60 uppercase">
              <span className="text-white font-bold">PRIVATE CLOUD:</span> SYNC DATA DIRECTLY TO YOUR OWN GOOGLE DRIVE HIDDEN STORAGE.
            </p>
          </div>
        </div>

        <button
          onClick={login}
          className="w-full rounded-none border-2 border-white bg-white py-4 text-xs font-black tracking-[0.3em] text-black hover:bg-[#BBFF00] hover:border-[#BBFF00] transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase cursor-pointer"
        >
          INITIALIZE_SESSION // GOOGLE_LOGIN
        </button>

        <p className="mt-8 text-center text-[8px] font-bold tracking-widest text-white/20 uppercase">
          © 2026 NEO_LEDGER_CORP // V.2.0.4-STABLE
        </p>
      </div>
    </div>
  );
}
