'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/currencyUtils';

interface BudgetTrackProps {
  category: string;
  id: string;
  spent: number;
  total: number;
  color: string; // Hex color for the bar
}

export function BudgetTrack({ category, id, spent, total, color }: BudgetTrackProps) {
  const { baseCurrency } = useAppStore();
  const percentage = Math.min((spent / total) * 100, 100);
  const isCritical = percentage > 90;
  const isStable = percentage < 60;

  const statusText = isCritical 
    ? `${percentage.toFixed(1)}% CRITICAL` 
    : isStable 
      ? `${percentage.toFixed(1)}% STABLE`
      : `${percentage.toFixed(1)}% UTILIZED`;

  return (
    <div className="border-2 border-white bg-black p-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge
            className="rounded-none border-0 px-2 py-0.5 text-[9px] font-black tracking-widest text-black"
            style={{ backgroundColor: color }}
          >
            {category}
          </Badge>
          <span className="font-mono text-[10px] font-bold tracking-widest text-white/40">
            ID: {id}
          </span>
        </div>
        <div className="font-mono text-[11px] font-bold tracking-tighter text-white">
          {formatCurrency(spent, baseCurrency)} <span className="text-white/20">/</span> {formatCurrency(total, baseCurrency)}
        </div>
      </div>

      <div className="relative h-8 w-full border-2 border-white bg-zinc-900 overflow-hidden">
        {/* Segmented Progress Bar */}
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: isCritical ? '#FF00FF' : color,
            backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.2) 2px, transparent 2px)',
            backgroundSize: '8px 100%'
          }}
        />
        
        {/* Status Text Overlay */}
        <div className={cn(
          "absolute inset-0 flex items-center px-3 text-[10px] font-black tracking-[0.2em] uppercase",
          percentage > 50 ? "text-black" : "text-white/60"
        )}>
          {statusText}
        </div>
      </div>
    </div>
  );
}
