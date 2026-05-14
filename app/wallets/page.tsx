'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetCard, InitiateProtocolCard } from '@/components/terminal/asset-card';
import { SyncTable } from '@/components/terminal/sync-table';
import { DashboardChrome } from '@/components/dashboard-chrome';

export default function WalletsPage() {
  return (
    <DashboardChrome>
      <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen bg-[#050505]">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-black tracking-tighter text-white uppercase leading-none">
              NEO_WALLETS
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-1 bg-[#BBFF00]" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
                REAL-TIME AGGREGATION OF CONNECTED ACCOUNTS
              </p>
            </div>
          </div>
          <Button className="rounded-none border-2 border-white bg-white px-6 py-6 text-xs font-black tracking-widest text-black hover:bg-[#BBFF00] hover:border-[#BBFF00] transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            <Plus className="mr-2 size-4" />
            ADD_SOURCE
          </Button>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AssetCard
            category="BANK_SAVINGS"
            balance="$42,890.00"
            currency="USD"
            maskedId="MASKED_CC_8892"
            status="SYNCED"
            color="magenta"
          />
          <AssetCard
            category="CRYPTO_HARDWARE"
            balance="1.248"
            currency="BTC"
            maskedId="ADDR_X92K...001A"
            status="SYNCED"
            color="acid-green"
          />
          <AssetCard
            category="INVESTMENT_PORTFOLIO"
            balance="$156,022.45"
            currency="USD"
            maskedId="FIDELITY_X_881"
            status="SYNCED"
            color="slate"
          />
          <AssetCard
            category="OPERATIONAL_CASH"
            balance="$8,211.10"
            currency="USD"
            maskedId="MASKED_CC_1102"
            status="SYNCED"
            color="slate"
          />
          <InitiateProtocolCard />
        </div>

        {/* Sync Table */}
        <div className="mt-4">
          <SyncTable />
        </div>

        {/* Decorative Bottom Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 h-48">
          <div className="relative border-2 border-white/10 bg-black overflow-hidden group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                  <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="none" stroke="#BBFF00" strokeWidth="0.5" strokeOpacity="0.3"/>
                    <circle cx="10" cy="10" r="2" fill="#BBFF00" fillOpacity="0.5"/>
                    <circle cx="90" cy="10" r="2" fill="#BBFF00" fillOpacity="0.5"/>
                    <circle cx="90" cy="90" r="2" fill="#BBFF00" fillOpacity="0.5"/>
                    <circle cx="10" cy="90" r="2" fill="#BBFF00" fillOpacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/20 tracking-[0.4em]">
              SYSTEM_DECOR_01 // CIRCUIT_MAP
            </div>
          </div>

          <div className="relative border-2 border-white/10 bg-black overflow-hidden group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
              <svg width="100%" height="100%" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <g stroke="white" strokeWidth="0.5" fill="none" strokeOpacity="0.5">
                  {[...Array(20)].map((_, i) => (
                    <path key={i} d={`M ${i * 30} 200 L ${i * 30 + 100} 0`} stroke={i % 2 === 0 ? '#FF00FF' : 'white'} />
                  ))}
                </g>
                <rect width="100%" height="100%" fill="url(#scanline)" />
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/20 tracking-[0.4em]">
              SYSTEM_DECOR_02 // VELOCITY_STREAM
            </div>
          </div>
        </div>
      </div>
    </DashboardChrome>
  );
}
