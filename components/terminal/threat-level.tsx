'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ThreatLevelProps {
  level: 'HIGH' | 'NOMINAL';
}

export function ThreatLevel({ level }: ThreatLevelProps) {
  const isHigh = level === 'HIGH';

  return (
    <div className={cn(
      "border-2 p-6 transition-colors duration-500",
      isHigh ? "border-[#FF0055] bg-[#FF0055]/5" : "border-[#BBFF00] bg-[#BBFF00]/5"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={cn(
          "text-[10px] font-bold tracking-[0.2em] uppercase",
          isHigh ? "text-[#FF0055]" : "text-[#BBFF00]"
        )}>
          THREAT_LEVEL
        </h3>
        <AlertTriangle className={cn("size-4", isHigh ? "text-[#FF0055]" : "text-[#BBFF00]")} />
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className={cn(
          "text-6xl font-black tracking-tighter mb-2",
          isHigh ? "text-[#FF0055]" : "text-[#BBFF00]"
        )}>
          {level}
        </div>
        {isHigh && (
          <div className="h-1 w-24 bg-[#FF0055] animate-pulse" />
        )}
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <p className="text-[10px] font-bold leading-relaxed tracking-wide text-white/60 uppercase">
          {isHigh 
            ? "SYSTEM DETECTED VELOCITY ANOMALY: Spending in COLLECTIBLES is 40% higher than historical mean for this cycle segment."
            : "SYSTEM PARAMETERS WITHIN NOMINAL RANGE. NO ANOMALIES DETECTED IN CURRENT CYCLE."}
        </p>
      </div>

      <Button className={cn(
        "mt-8 w-full rounded-none border-2 py-6 text-xs font-black tracking-[0.2em] transition-all",
        isHigh 
          ? "border-white bg-white text-black shadow-[4px_4px_0px_0px_rgba(255,0,85,1)] hover:bg-[#FF0055] hover:text-white"
          : "border-white bg-transparent text-white hover:bg-white/10"
      )}>
        {isHigh ? "ENGAGE_RESTRAINT" : "SYSTEM_CHECK"}
      </Button>
    </div>
  );
}
