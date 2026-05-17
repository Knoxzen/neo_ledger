'use client';

export function SystemLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="text-[10px] font-bold tracking-[0.3em] text-[#BBFF00] animate-pulse">
          BOOTING_SYSTEM_KERNEL...
        </div>
        <div className="h-1 w-48 overflow-hidden border border-white/20">
          <div className="h-full w-full bg-[#BBFF00] origin-left animate-neo-progress" />
        </div>
      </div>
    </div>
  );
}
