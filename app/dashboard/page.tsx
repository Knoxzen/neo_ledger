'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

import { DashboardChrome } from '@/components/dashboard-chrome';
import { SystemLoader } from '@/components/SystemLoader';
import { CommandCenter } from '@/components/command-center';
import { DashboardWidgets } from '@/components/dashboard-widgets';
import { MonthlyOutflowCard } from '@/components/monthly-outflow-card';
import { RecentLogs } from '@/components/recent-logs';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isLoggedIn, status } = useAuth();
  const { loadSettingsFromDrive } = useAppStore();
  const router = useRouter();
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  useEffect(() => {
    console.log(`DASHBOARD_PAGE: STATUS=${status} IS_LOGGED_IN=${isLoggedIn}`);
    if (status === 'unauthenticated') {
      console.log('DASHBOARD_PAGE: REDIRECTING_TO_HOME');
      router.push('/');
    }
    if (isLoggedIn) {
      loadSettingsFromDrive();
    }
  }, [isLoggedIn, status, loadSettingsFromDrive, router]);

  if (status === 'loading') {
    return <SystemLoader />;
  }

  if (status === 'unauthenticated') {
    return null; // Redirecting...
  }

  // The layout Suspense and component guards handle loading states


  return (
    <DashboardChrome>
      <main className="neo-page-pad grid grid-cols-1 gap-[clamp(1rem,3vw,1.75rem)] py-[clamp(0.75rem,3vw,2rem)] xl:grid-cols-12">
        <section className="flex min-w-0 flex-col gap-[clamp(1rem,3vw,1.5rem)] xl:col-span-8">
          <MonthlyOutflowCard />
          <DashboardWidgets />
        </section>

        <aside className="hidden min-w-0 flex-col gap-4 xl:col-span-4 xl:flex">
          <RecentLogs />
        </aside>
      </main>

      <Drawer open={isCommandCenterOpen} onOpenChange={setIsCommandCenterOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 size-[clamp(3.25rem,10vw,4rem)] rounded-none border-2 border-white bg-[#BBFF00] p-0 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#BBFF00] focus-visible:ring-0 focus-visible:ring-offset-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
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
            <DrawerDescription className="sr-only">
              Log a new transaction using natural language parsing.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-[clamp(1rem,4vw,2rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="rounded-none border-2 border-white bg-[#121212] p-[clamp(1rem,3vw,1.5rem)] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <CommandCenter onTrackSuccess={() => setIsCommandCenterOpen(false)} />
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
