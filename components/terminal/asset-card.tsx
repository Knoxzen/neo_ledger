'use client';

import React from 'react';
import { Plus, Bitcoin, Landmark, TrendingUp, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AssetCardProps {
  category: string;
  balance: string;
  currency: string;
  maskedId: string;
  status: 'SYNCED' | 'ERROR' | 'PENDING';
  color: 'magenta' | 'acid-green' | 'slate';
  icon?: React.ReactNode;
}

const colorMap = {
  magenta: 'bg-[#FF00FF]',
  'acid-green': 'bg-[#BBFF00]',
  slate: 'bg-[#475569]',
};

const iconMap: Record<string, React.ReactNode> = {
  BANK_SAVINGS: <Landmark className="size-5" />,
  CRYPTO_HARDWARE: <Bitcoin className="size-5" />,
  INVESTMENT_PORTFOLIO: <TrendingUp className="size-5" />,
  OPERATIONAL_CASH: <Landmark className="size-5" />,
};

export function AssetCard({
  category,
  balance,
  currency,
  maskedId,
  status,
  color,
  icon,
}: AssetCardProps) {
  return (
    <Card className="rounded-none border-2 border-white bg-black p-0 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <Badge
            className={cn(
              'rounded-none border-0 px-3 py-1 text-[10px] font-bold tracking-widest text-black',
              colorMap[color]
            )}
          >
            {category}
          </Badge>
          <div className="text-white/40">
            {icon || iconMap[category] || <Cpu className="size-5" />}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            CURRENT_BALANCE
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[clamp(1.5rem,5vw,2.5rem)] font-black tracking-tighter text-white">
              {balance}
            </span>
            <span className="text-[clamp(0.875rem,3vw,1.25rem)] font-bold text-white/60">
              {currency}
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="font-mono text-[10px] tracking-widest text-white/40">
            {maskedId}
          </span>
          {status === 'SYNCED' && (
            <div className="flex items-center gap-2 border border-[#BBFF00]/30 bg-[#BBFF00]/5 px-2 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#BBFF00] animate-pulse" />
              <span className="text-[9px] font-bold tracking-widest text-[#BBFF00]">
                SYNCED
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function InitiateProtocolCard() {
  return (
    <button
      type="button"
      className="group relative flex aspect-square w-full flex-col items-center justify-center border-2 border-dashed border-white/20 bg-transparent transition-all hover:border-[#BBFF00]/50 hover:bg-[#BBFF00]/5 sm:aspect-auto sm:h-full min-h-[220px]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center border-2 border-white/20 group-hover:border-[#BBFF00] transition-colors">
          <Plus className="size-6 text-white/40 group-hover:text-[#BBFF00]" />
        </div>
        <div className="text-center">
          <div className="text-[10px] font-bold tracking-[0.2em] text-white/20 group-hover:text-[#BBFF00]/60 uppercase">
            INITIATE_NEW_PROTOCOL
          </div>
        </div>
      </div>
    </button>
  );
}
