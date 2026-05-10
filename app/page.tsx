import { Zap } from 'lucide-react';

import { DashboardChrome } from '@/components/dashboard-chrome';
import { CommandCenter } from '@/components/command-center';
import { DashboardWidgets } from '@/components/dashboard-widgets';
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
    <DashboardChrome>
      <main className="neo-page-pad grid grid-cols-1 gap-[clamp(1rem,3vw,1.75rem)] py-[clamp(0.75rem,3vw,2rem)] xl:grid-cols-12">
        <section className="flex min-w-0 flex-col gap-[clamp(1rem,3vw,1.5rem)] xl:col-span-8">
          <MonthlyOutflowCard />
          <DashboardWidgets />
        </section>

        <aside className="flex min-w-0 flex-col gap-4 xl:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="border-l-4 border-[#BBFF00] pl-2 text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest">
              LEDGER // RECENT_LOGS
            </h2>
            <span className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/60">
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
        </aside>
      </main>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            type="button"
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-50 size-[clamp(3.25rem,10vw,4rem)] rounded-none border-2 border-white bg-[#BBFF00] p-0 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#BBFF00] focus-visible:ring-0 focus-visible:ring-offset-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all lg:left-68"
            aria-label="Open command center"
          >
            <Zap className="size-[clamp(1.5rem,5vw,2rem)]" />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="rounded-none border-t-2 border-white bg-[#050505] text-white shadow-[4px_-4px_0px_0px_rgba(0,0,0,1)]">
          <DrawerHeader className="px-[clamp(1rem,4vw,2rem)] pt-6 text-left sm:pt-8">
            <DrawerTitle className="text-[clamp(10px,2.8vw,12px)] font-bold tracking-widest text-white/70">
              COMMAND CENTER // ACTIVE_LOG
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-[clamp(1rem,4vw,2rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="border-2 border-white bg-[#121212] p-[clamp(1rem,3vw,1.5rem)] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <CommandCenter />
            </div>
            <div className="mt-4 text-center text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/40">
              ESC TO CANCEL_PROCESS
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </DashboardChrome>
  );
}
