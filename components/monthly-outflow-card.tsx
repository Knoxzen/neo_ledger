'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTerminalData } from '../hooks/useTerminalData';
import { useAppStore } from '@/store/useAppStore';
import { getCurrencySymbol } from '@/lib/currencyUtils';

export function MonthlyOutflowCard() {
  const { data, isLoading } = useTerminalData();
  const { baseCurrency } = useAppStore();
  const currencySymbol = getCurrencySymbol(baseCurrency || 'INR');
  const totalValue = data?.manifest?.total_burn || 0;
  const budgetUsedPercent = data?.manifest?.burn_rate ? (totalValue / 5000) * 100 : 0; // Assuming 5000 as a soft limit for now
  const safePercent = Math.min(100, Math.max(0, budgetUsedPercent));
  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase().replace(' ', '_');

  return (
    <Card className="rounded-none border-2 border-white bg-[#121212] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-0">
      <CardContent className="p-[clamp(1rem,3.5vw,2rem)]">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <span className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/70">
            TOTAL MONTHLY OUTFLOW
          </span>
          <span className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/50">
            {monthLabel}
          </span>
        </div>

        <div className="mt-2 wrap-break-word font-black leading-none tracking-tight text-white sm:mt-3 text-[clamp(2rem,12vw+0.5rem,5.25rem)]">
          {currencySymbol}{totalValue.toLocaleString()}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-[#BBFF00]">
              FLEX BUDGET
            </span>
            <span className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-[#BBFF00]">
              {safePercent}% DEPLETED
            </span>
          </div>

          <Progress
            value={safePercent}
            className="h-[clamp(0.875rem,2.5vw,1.5rem)] rounded-none border-2 border-white bg-[#050505] **:data-[slot=progress-indicator]:bg-[#BBFF00]"
          />
        </div>
      </CardContent>
    </Card>
  );
}

