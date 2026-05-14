import React from 'react';

const RECENT_LOGS_DATA = [
  { title: 'VINTAGE SEIKO', amount: '#12,500', tag: 'COLLECTIBLES', tagBg: '#FF00FF' },
  { title: 'RAMEN', amount: '#1,200', tag: 'FOOD', tagBg: '#BBFF00' },
  { title: 'SUBWAY', amount: '#450', tag: 'TRANSPORT', tagBg: '#A1A1AA' },
];

export function RecentLogs() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="border-l-4 border-[#BBFF00] pl-2 text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest">
          LEDGER // RECENT_LOGS
        </h2>
        <span className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/60">
          FILTER
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {RECENT_LOGS_DATA.map((item) => (
          <div
            key={item.title}
            className="border-2 border-white bg-[#121212] p-[clamp(0.75rem,3vw,1rem)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors hover:border-[#BBFF00]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[clamp(1rem,4vw,1.125rem)] font-black tracking-tight">
                  {item.title}
                </div>
                <div className="text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/60">
                  2026-05-10 20:34
                </div>
              </div>
              <div className="shrink-0 text-[clamp(1rem,4vw,1.125rem)] font-black">
                {item.amount}
              </div>
            </div>
            <div
              className="mt-3 inline-block border-2 border-white px-3 py-1 text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-black"
              style={{ backgroundColor: item.tagBg }}
            >
              {item.tag}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="border-2 border-dashed border-white bg-[#121212] p-[clamp(0.75rem,3vw,1rem)] text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/70 hover:bg-white/5"
      >
        LOAD_MORE_HISTORY.EXE
      </button>
    </div>
  );
}
