'use client';

import { useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    if (!navOpen) return;

    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') closeNav();
    }

    window.addEventListener('keydown', onEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [navOpen, closeNav]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      {/* Mobile overlay */}
      <div
        role="presentation"
        aria-hidden={!navOpen}
        className={cn(
          'fixed inset-0 z-40 bg-black/70 transition-opacity duration-200 lg:pointer-events-none',
          navOpen
            ? 'opacity-100 lg:opacity-0'
            : 'pointer-events-none opacity-0'
        )}
        onClick={closeNav}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[min(18rem,88vw)] flex-col border-r-2 border-white bg-[#050505] px-[clamp(0.75rem,3vw,1rem)] pb-24 pt-[clamp(0.75rem,3vw,1rem)] shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 ease-out sm:w-64 lg:translate-x-0',
          navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="mb-[clamp(1rem,3vw,2rem)] flex items-start justify-between gap-3 pr-1">
          <div>
            <h1 className="text-[clamp(1.25rem,5vw,1.875rem)] font-black tracking-tight uppercase">
              TERMINAL_01
            </h1>
            <p className="mt-1 text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/70">
              V.0.1.0-ALPHA
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-none border-2 border-white bg-[#121212] p-2 hover:bg-white/10 lg:hidden"
            onClick={closeNav}
            aria-label="Close menu"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        <nav className="flex flex-[1_1_auto] flex-col gap-2 overflow-y-auto">
          <a
            className="translate-x-px translate-y-px border-2 border-white bg-[#BBFF00] px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.5rem,2vw,0.75rem)] text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-black shadow-none"
            href="#"
            onClick={closeNav}
          >
            DASHBOARD
          </a>
          {['ANALYTICS', 'BUDGET', 'WALLETS', 'SETTINGS'].map((label) => (
            <a
              key={label}
              className="border-2 border-transparent px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.5rem,2vw,0.75rem)] text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/80 hover:border-white hover:bg-white/5"
              href="#"
              onClick={closeNav}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[clamp(0.75rem,3vw,1rem)] right-[clamp(0.75rem,3vw,1rem)] border-t-2 border-white/20 pt-4">
          <button
            type="button"
            className="w-full border-2 border-white bg-white px-4 py-3 text-left text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            onClick={closeNav}
          >
            NEW LOG
          </button>
          <button
            type="button"
            className="mt-2 w-full px-4 py-3 text-left text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-[#FF00FF] hover:bg-[#FF00FF]/10"
            onClick={closeNav}
          >
            LOGOUT
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 min-h-16 w-full border-b-2 border-white bg-[#050505] px-[clamp(0.75rem,3vw,2rem)] py-3 pl-[clamp(0.75rem,3vw,2rem)] lg:min-h-20 lg:pl-72">
        <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <Button
              type="button"
              className="shrink-0 rounded-none border-2 border-white bg-[#121212] px-3 py-2 text-white hover:bg-white/10 lg:hidden"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 text-[clamp(1.125rem,4.5vw,2.25rem)] font-black tracking-tight uppercase leading-none">
              NEO_LEDGER
            </div>
            <div className="hidden items-center gap-2 border border-white bg-[#121212] px-2 py-1 sm:flex sm:px-3">
              <div className="h-2 w-2 shrink-0 bg-[#BBFF00] animate-pulse" />
              <span className="text-[clamp(8px,2vw,10px)] font-bold tracking-widest text-[#BBFF00]/80">
                ONLINE
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-white/90 sm:gap-4">
            <span className="hidden text-[clamp(10px,2vw,12px)] font-bold tracking-widest md:inline">
              NOTIFS
            </span>
            <span className="hidden text-[clamp(10px,2vw,12px)] font-bold tracking-widest lg:inline">
              TERMINAL
            </span>
            <span className="text-[clamp(10px,2vw,12px)] font-bold tracking-widest">
              USER
            </span>
          </div>
        </div>
      </header>

      <div className="w-full lg:ml-64">{children}</div>
    </div>
  );
}
