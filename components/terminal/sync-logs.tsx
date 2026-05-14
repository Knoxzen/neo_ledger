'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  entity: string;
  class: string;
  val: string;
  classColor: string;
}

const LOGS: LogEntry[] = [
  {
    timestamp: '12:04:11',
    entity: 'SYNTH_FOOD_LABS',
    class: 'DINING',
    val: '-$42.00',
    classColor: '#BBFF00',
  },
  {
    timestamp: '09:15:32',
    entity: 'GPU_MARKET_0X',
    class: 'COLLECTIBLES',
    val: '-$1,200.00',
    classColor: '#FF00FF',
  },
  {
    timestamp: '08:00:00',
    entity: 'VOID_RESIDENCY_LLC',
    class: 'RENT',
    val: '-$3,200.00',
    classColor: '#00FFFF',
  },
];

export function SyncLogs() {
  return (
    <div className="border-2 border-white bg-black">
      <div className="flex items-center gap-2 border-b-2 border-white px-4 py-3">
        <Database className="size-4 text-white/40" />
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
          RECENT_SYNC_LOGS
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[11px] tracking-wider">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/40">
              <th className="px-4 py-3 font-bold uppercase">TIMESTAMP</th>
              <th className="px-4 py-3 font-bold uppercase">ENTITY</th>
              <th className="px-4 py-3 font-bold uppercase">CLASS</th>
              <th className="px-4 py-3 font-bold uppercase text-right">VAL</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, i) => (
              <tr
                key={i}
                className="group border-b border-white/5 transition-colors hover:bg-white/5"
              >
                <td className="whitespace-nowrap px-4 py-3 text-white/60">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 text-white/80 group-hover:text-[#BBFF00]">
                  {log.entity}
                </td>
                <td className="px-4 py-3">
                  <div 
                    className="inline-block border px-2 py-0.5 text-[9px] font-bold tracking-widest"
                    style={{ color: log.classColor, borderColor: log.classColor }}
                  >
                    {log.class}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-white/80">
                  {log.val}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
