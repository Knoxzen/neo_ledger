'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GlitchSwitchProps {
  label: string;
  initialState?: boolean;
}

export function GlitchSwitch({ label, initialState = false }: GlitchSwitchProps) {
  const [enabled, setEnabled] = useState(initialState);

  return (
    <div className="mb-4 flex items-center justify-between border-2 border-white/5 bg-black/40 px-4 py-3">
      <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
        {label}
      </span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "relative h-6 w-12 border-2 transition-colors duration-200",
          enabled ? "border-[#BBFF00] bg-[#BBFF00]/10" : "border-white/20 bg-transparent"
        )}
      >
        <div 
          className={cn(
            "absolute top-0 h-full w-5 border-2 transition-all duration-200",
            enabled 
              ? "left-6 border-black bg-[#BBFF00]" 
              : "left-0 border-white bg-white/20"
          )}
        />
      </button>
    </div>
  );
}
