'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ApiKeyInputProps {
  label: string;
  value: string;
}

export function ApiKeyInput({ label, value }: ApiKeyInputProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex flex-1 items-center border-2 border-white/20 bg-black px-4 py-3">
          <div className="flex gap-1 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#BBFF00] animate-pulse" />
          </div>
        </div>
        <Button className="rounded-none border-2 border-white bg-[#FF00FF] px-6 py-3 text-[10px] font-black tracking-widest text-black hover:bg-[#FF00FF]/80">
          REPLACE
        </Button>
      </div>
    </div>
  );
}
