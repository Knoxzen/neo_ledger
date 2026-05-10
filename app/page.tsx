import { Bolt, Zap } from 'lucide-react';

import { CommandCenter } from '@/components/command-center';
import { MonthlyOutflowCard } from '@/components/monthly-outflow-card';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r-2 border-white bg-[#050505] p-4 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase">
            TERMINAL_01
          </h1>
          <p className="mt-1 text-[10px] font-bold tracking-widest text-white/70">
            V.0.1.0-ALPHA
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <a
            className="translate-x-1 translate-y-1 border-2 border-white bg-[#BBFF00] px-4 py-3 text-[12px] font-bold tracking-widest text-black shadow-none"
            href="#"
          >
            DASHBOARD
          </a>
          <a
            className="border-2 border-transparent px-4 py-3 text-[12px] font-bold tracking-widest text-white/80 hover:border-white hover:bg-white/5"
            href="#"
          >
            ANALYTICS
          </a>
          <a
            className="border-2 border-transparent px-4 py-3 text-[12px] font-bold tracking-widest text-white/80 hover:border-white hover:bg-white/5"
            href="#"
          >
            BUDGET
          </a>
          <a
            className="border-2 border-transparent px-4 py-3 text-[12px] font-bold tracking-widest text-white/80 hover:border-white hover:bg-white/5"
            href="#"
          >
            WALLETS
          </a>
          <a
            className="border-2 border-transparent px-4 py-3 text-[12px] font-bold tracking-widest text-white/80 hover:border-white hover:bg-white/5"
            href="#"
          >
            SETTINGS
          </a>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 border-t-2 border-white/20 pt-4">
          <button className="w-full border-2 border-white bg-white px-4 py-3 text-left text-[12px] font-bold tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            NEW LOG
          </button>
          <button className="mt-2 w-full px-4 py-3 text-left text-[12px] font-bold tracking-widest text-[#FF00FF] hover:bg-[#FF00FF]/10">
            LOGOUT
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 h-20 w-full border-b-2 border-white bg-[#050505] px-8 pl-72">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black tracking-tight uppercase">
              NEO_LEDGER
            </div>
            <div className="flex items-center gap-2 border border-white bg-[#121212] px-3 py-1">
              <div className="h-2 w-2 bg-[#BBFF00] animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-[#BBFF00]/80">
                SYSTEM ONLINE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <span className="text-xs font-bold tracking-widest">NOTIFS</span>
            <span className="text-xs font-bold tracking-widest">TERMINAL</span>
            <span className="text-xs font-bold tracking-widest">USER</span>
          </div>
        </div>
      </header>

      <main className="ml-64 grid grid-cols-12 gap-6 p-8">
        <section className="col-span-8 flex flex-col gap-6">
          <MonthlyOutflowCard />
        </section>

        <aside className="col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-[#BBFF00] pl-2 text-[12px] font-bold tracking-widest">
              LEDGER // RECENT_LOGS
            </h2>
            <span className="text-[12px] font-bold tracking-widest text-white/60">
              FILTER
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { title: 'VINTAGE SEIKO', amount: '#12,500', tag: 'COLLECTIBLES', tagBg: '#FF00FF' },
              { title: 'RAMEN', amount: '#1,200', tag: 'FOOD', tagBg: '#BBFF00' },
              { title: 'SUBWAY', amount: '#450', tag: 'TRANSPORT', tagBg: '#A1A1AA' },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-white bg-[#121212] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#BBFF00] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-black tracking-tight">
                      {item.title}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-white/60">
                      2026-05-10 20:34
                    </div>
                  </div>
                  <div className="text-lg font-black">{item.amount}</div>
                </div>
                <div
                  className="mt-3 inline-block border-2 border-white px-3 py-1 text-[10px] font-bold tracking-widest text-black"
                  style={{ backgroundColor: item.tagBg }}
                >
                  {item.tag}
                </div>
              </div>
            ))}
          </div>

          <button className="border-2 border-dashed border-white bg-[#121212] p-4 text-[12px] font-bold tracking-widest text-white/70 hover:bg-white/5">
            LOAD_MORE_HISTORY.EXE
          </button>
        </aside>
      </main>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            type="button"
            className="fixed bottom-8 right-0 z-50 size-16 rounded-none border-2 border-white bg-[#BBFF00] p-0 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#BBFF00] focus-visible:ring-0 focus-visible:ring-offset-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            aria-label="Open command center"
          >
            <Zap className="size-8" />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="rounded-none border-t-2 border-white bg-[#050505] text-white shadow-[4px_-4px_0px_0px_rgba(0,0,0,1)]">
          <DrawerHeader className="px-8 pt-8 text-left">
            <DrawerTitle className="text-[12px] font-bold tracking-widest text-white/70">
              COMMAND CENTER // ACTIVE_LOG
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-8 pb-10">
            <div className="border-2 border-white bg-[#121212] p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <CommandCenter />
            </div>
            <div className="mt-4 text-center text-[10px] font-bold tracking-widest text-white/40">
              ESC TO CANCEL_PROCESS
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
