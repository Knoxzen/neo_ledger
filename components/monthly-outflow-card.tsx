'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

import { Progress } from '@/components/ui/progress';

interface MonthlyOutflowCardProps {
  monthLabel?: string;
  totalLabel?: string;
  totalValue?: string;
  budgetLabel?: string;
  budgetUsedPercent?: number; // 0..100
}

export function MonthlyOutflowCard({
  monthLabel = 'MAY_2026',
  totalLabel = 'TOTAL MONTHLY OUTFLOW',
  totalValue = '#42,900',
  budgetLabel = 'FLEX BUDGET',
  budgetUsedPercent = 84,
}: MonthlyOutflowCardProps) {
  const safePercent = Math.min(100, Math.max(0, budgetUsedPercent));

  return (
    <Card className="rounded-none border-2 border-white bg-[#121212] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-0">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <span className="text-[12px] font-bold tracking-widest text-white/70">
            {totalLabel}
          </span>
          <span className="text-[12px] font-bold tracking-widest text-white/50">
            {monthLabel}
          </span>
        </div>

        <div className="mt-3 text-[84px] font-black leading-none tracking-tight text-white">
          {totalValue}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-bold tracking-widest text-[#BBFF00]">
              {budgetLabel}
            </span>
            <span className="text-[12px] font-bold tracking-widest text-[#BBFF00]">
              {safePercent}% DEPLETED
            </span>
          </div>

          <Progress
            value={safePercent}
            className="h-6 rounded-none border-2 border-white bg-[#050505] **:data-[slot=progress-indicator]:bg-[#BBFF00]"
          />
        </div>
      </CardContent>
    </Card>
  );
}

