'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SyncLog {
  timestamp: string;
  action: string;
  origin: string;
  status: 'SUCCESS_00' | 'ERROR_RETRIEVING' | 'PENDING_AUTH';
}

const LOGS: SyncLog[] = [
  {
    timestamp: '2023.10.27 // 14:02:11',
    action: 'WEBHOOK_PULL_REQUEST',
    origin: 'FIDELITY_MAIN_NODE',
    status: 'SUCCESS_00',
  },
  {
    timestamp: '2023.10.27 // 13:58:45',
    action: 'CRYPTO_NODE_SCAN',
    origin: 'ETH_MAINNET_E72',
    status: 'SUCCESS_00',
  },
  {
    timestamp: '2023.10.27 // 12:44:02',
    action: 'API_HANDSHAKE_AUTH',
    origin: 'CHASE_BANK_USA',
    status: 'ERROR_RETRIEVING',
  },
];

export function SyncTable() {
  return (
    <div className="w-full border-2 border-white bg-black">
      <div className="flex items-center justify-between border-b-2 border-white px-4 py-3">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
          SYNC_HISTORY_LOG_01
        </h3>
        <div className="flex items-center gap-2 border border-[#FF0055]/30 bg-[#FF0055]/10 px-2 py-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#FF0055] animate-pulse" />
          <span className="text-[9px] font-bold tracking-widest text-[#FF0055]">
            LIVE_FEED
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[11px] tracking-wider">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/40">
              <th className="px-4 py-3 font-bold uppercase">TIMESTAMP</th>
              <th className="px-4 py-3 font-bold uppercase">ACTION</th>
              <th className="px-4 py-3 font-bold uppercase">ORIGIN</th>
              <th className="px-4 py-3 font-bold uppercase text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, i) => (
              <tr
                key={i}
                className="group border-b border-white/5 transition-colors hover:bg-white/5"
              >
                <td className="whitespace-nowrap px-4 py-3 text-white/60 group-hover:text-[#BBFF00]">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 text-white/80 group-hover:text-[#BBFF00]">
                  {log.action}
                </td>
                <td className="px-4 py-3 text-white/80 group-hover:text-[#BBFF00]">
                  {log.origin}
                </td>
                <td className="px-4 py-3 text-right group-hover:text-[#BBFF00]">
                  <span
                    className={cn(
                      'font-bold',
                      log.status === 'SUCCESS_00' ? 'text-[#BBFF00]' : 'text-[#FF0055]'
                    )}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
