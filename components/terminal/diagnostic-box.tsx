'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DiagnosticBoxProps {
  label: string;
  value: string;
  color: string;
}

export function DiagnosticBox({ label, value, color }: DiagnosticBoxProps) {
  return (
    <div 
      className="border-2 border-white bg-black p-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      <div className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">
        {label}
      </div>
      <div className="text-2xl font-black tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}
