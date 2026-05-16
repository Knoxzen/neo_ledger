'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, History } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RecentLogs } from '@/components/recent-logs';
import { ExecuteBar } from '@/components/terminal/execute-bar';
import { cn } from '@/lib/utils';

import { LogoutModal } from '@/components/LogoutModal';

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    if (!navOpen && !historyOpen && !logoutModalOpen) return;

    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeNav();
        setHistoryOpen(false);
        setLogoutModalOpen(false);
      }
    }

    window.addEventListener('keydown', onEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [navOpen, historyOpen, logoutModalOpen, closeNav]);

  const navItems = [
    { label: 'DASHBOARD', href: '/dashboard' },
    { label: 'ANALYTICS', href: '/analytics' },
    { label: 'BUDGET', href: '/budget' },
    { label: 'WALLETS', href: '/wallets' },
    { label: 'SETTINGS', href: '/settings' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
      <LogoutModal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
      {/* Mobile Nav overlay */}
      <div
        role="presentation"
        aria-hidden={!navOpen}
        className={cn(
          'fixed inset-0 z-40 bg-black/70 transition-opacity duration-200 lg:hidden',
          navOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeNav}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[min(18rem,88vw)] flex-col border-r-2 border-white bg-[#050505] px-[clamp(0.75rem,3vw,1rem)] pb-24 pt-[clamp(0.75rem,3vw,1rem)] shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 ease-out sm:static sm:z-0 sm:w-64 sm:translate-x-0',
          navOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
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
            className="shrink-0 rounded-none border-2 border-white bg-[#121212] p-2 hover:bg-white/10 sm:hidden"
            onClick={closeNav}
            aria-label="Close menu"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        <nav className="no-scrollbar flex flex-[1_1_auto] flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeNav}
                className={cn(
                  'border-2 px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.5rem,2vw,0.75rem)] text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest transition-all',
                  isActive
                    ? 'translate-x-px translate-y-px border-white bg-[#BBFF00] text-black shadow-none'
                    : 'border-transparent text-white/80 hover:border-white hover:bg-white/5'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[clamp(0.75rem,3vw,1rem)] right-[clamp(0.75rem,3vw,1rem)] border-t-2 border-white/20 pt-4 lg:static lg:mt-auto lg:border-t-2 lg:px-0">
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
            onClick={() => {
              setLogoutModalOpen(true);
              closeNav();
            }}
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex min-h-16 w-full border-b-2 border-white bg-[#050505] px-[clamp(0.75rem,3vw,2rem)] py-3 lg:min-h-20">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
              <Button
                type="button"
                className="shrink-0 rounded-none border-2 border-white bg-[#121212] px-3 py-2 text-white hover:bg-white/10 sm:hidden"
                onClick={() => setNavOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
              <div className="min-w-0 text-[clamp(1.125rem,4.5vw,2.25rem)] font-black tracking-tight uppercase leading-none text-[#BBFF00]">
                {pathname === '/analytics' ? 'NEO_ANALYTICS' : 'NEO_LEDGER'}
              </div>
              <div className="hidden items-center gap-2 border border-white bg-[#121212] px-2 py-1 sm:flex sm:px-3">
                <div className="h-2 w-2 shrink-0 bg-[#BBFF00] animate-pulse" />
                <span className="text-[clamp(8px,2vw,10px)] font-bold tracking-widest text-[#BBFF00]/80">
                  ONLINE
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-white/90 sm:gap-4">
              <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex h-auto rounded-none border-2 border-white bg-transparent px-3 py-2 text-[clamp(10px,2vw,12px)] font-bold tracking-widest hover:bg-white hover:text-black xl:hidden"
                  >
                    <History className="mr-2 size-4" />
                    HISTORY
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="rounded-none border-t-2 border-white bg-[#050505] text-white">
                  <DrawerHeader className="border-b-2 border-white/10 px-[clamp(1rem,4vw,2rem)] py-4">
                    <DrawerTitle className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/70">
                      LEDGER // HISTORY_FEED
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="max-h-[70vh] overflow-y-auto px-[clamp(1rem,4vw,2rem)] py-6">
                    <RecentLogs />
                  </div>
                </DrawerContent>
              </Drawer>

              <div className="hidden lg:block mr-4">
                <ExecuteBar />
              </div>

              <span className="hidden text-[clamp(10px,2vw,12px)] font-bold tracking-widest md:inline">
                NOTIFS
              </span>
              <span className="text-[clamp(10px,2vw,12px)] font-bold tracking-widest">
                USER
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
