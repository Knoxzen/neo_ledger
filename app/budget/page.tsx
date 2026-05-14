'use client';

import React from 'react';
import { DashboardChrome } from '@/components/dashboard-chrome';
import { BudgetTrack } from '@/components/terminal/budget-progress';
import { ThreatLevel } from '@/components/terminal/threat-level';
import { DiagnosticBox } from '@/components/terminal/diagnostic-box';
import { AllocationWheel } from '@/components/terminal/allocation-wheel';
import { SyncLogs } from '@/components/terminal/sync-logs';

export default function BudgetPage() {
  return (
    <DashboardChrome>
      <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen bg-[#000000]">
        {/* Header section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-[#BBFF00]" />
              <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-black tracking-tighter text-white uppercase leading-none">
                FLEX_BUDGET_PROTOCOLS
              </h1>
            </div>
            <p className="mt-3 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
              Active Protocol: <span className="text-white/80">Q3_LIQUIDITY_RESERVE</span>
            </p>
          </div>

          <div className="relative border-2 border-white bg-black p-4 pr-12 shadow-[4px_4px_0px_0px_rgba(255,0,255,0.3)] min-w-[240px]">
            <div className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">
              TOTAL_MONTHLY_CAP
            </div>
            <div className="text-3xl font-black tracking-tight text-white">
              $14,500.00
            </div>
            <div className="absolute right-0 top-0 h-full w-1.5 bg-[#FF00FF]" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Budget Tracks */}
          <div className="xl:col-span-8 flex flex-col gap-2">
            <BudgetTrack
              category="DINING"
              id="D-402"
              spent={1240}
              total={1500}
              color="#BBFF00"
            />
            <BudgetTrack
              category="COLLECTIBLES"
              id="C-912"
              spent={4800}
              total={5000}
              color="#FF00FF"
            />
            <BudgetTrack
              category="RENT"
              id="R-001"
              spent={3200}
              total={3200}
              color="#00FFFF"
            />
            <BudgetTrack
              category="HARDWARE"
              id="H-773"
              spent={2100}
              total={4000}
              color="#BBFF00"
            />

            <div className="mt-6">
              <SyncLogs />
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <ThreatLevel level="HIGH" />
            
            <div className="grid grid-cols-2 gap-4">
              <DiagnosticBox 
                label="AUTO_SAVE" 
                value="$402" 
                color="#BBFF00" 
              />
              <DiagnosticBox 
                label="RUNRATE" 
                value="1.2x" 
                color="#00FFFF" 
              />
            </div>

            <AllocationWheel />

            {/* AI Prediction Box */}
            <div className="border-2 border-dashed border-white/20 bg-zinc-900/50 p-6 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-[#BBFF00] flex items-center justify-center text-black">
                  <span className="text-xs font-black">AI</span>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2">AI_PREDICTION_LOG</h4>
                   <p className="text-[11px] font-medium leading-relaxed text-white/80">
                      Current velocity suggests budget exhaustion in <span className="text-[#FF00FF] font-bold">7.2 days</span>. Consider activating 
                      <span className="text-[#BBFF00] font-bold"> SAVING_DRIVE_V2</span>.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardChrome>
  );
}
