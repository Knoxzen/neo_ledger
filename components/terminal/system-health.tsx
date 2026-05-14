'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function SystemHealth() {
  return (
    <div className="border-2 border-white/10 bg-black p-6">
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-6">
        SYSTEM_HEALTH
      </h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-[10px] font-bold tracking-widest mb-2">
            <span className="text-white/60">CPU_LOAD</span>
            <span className="text-[#BBFF00]">12.4%</span>
          </div>
          <div className="h-1 w-full bg-white/10">
            <div className="h-full bg-[#BBFF00]" style={{ width: '12.4%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold tracking-widest mb-2">
            <span className="text-white/60">MEM_ALLOC</span>
            <span className="text-[#BBFF00]">2.1GB</span>
          </div>
          <div className="h-1 w-full bg-white/10">
            <div className="h-full bg-[#BBFF00]" style={{ width: '45%' }} />
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-bold tracking-widest pt-2">
          <span className="text-white/60 uppercase">LATENCY</span>
          <span className="text-[#FF00FF]">42ms</span>
        </div>
      </div>
    </div>
  );
}
