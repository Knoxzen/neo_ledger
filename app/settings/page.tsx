'use client';

import React from 'react';
import { Search, Bell, Monitor, User, Key, BrainCircuit, Activity, Cpu, Coins } from 'lucide-react';
import { DashboardChrome } from '@/components/dashboard-chrome';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApiKeyInput } from '@/components/terminal/api-key-input';
import { SensitivitySlider } from '@/components/terminal/sensitivity-slider';
import { GlitchSwitch } from '@/components/terminal/glitch-switch';
import { SystemHealth } from '@/components/terminal/system-health';
import Image from 'next/image';

import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTerminalData } from '@/hooks/useTerminalData';

export default function SettingsPage() {
  const { geminiApiKey, setGeminiApiKey, baseCurrency, setBaseCurrency, syncSettingsToDrive, loadSettingsFromDrive } = useAppStore();
  const [localKey, setLocalKey] = useState(geminiApiKey || '');
  const [localCurrency, setLocalCurrency] = useState(baseCurrency || 'INR');
  const [isSaving, setIsSaving] = useState(false);

  const { wipeoutData } = useTerminalData();
  const [isWipeoutModalOpen, setIsWipeoutModalOpen] = useState(false);
  const [wipeoutConfirmation, setWipeoutConfirmation] = useState('');
  const [isWipingOut, setIsWipingOut] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    loadSettingsFromDrive().then(() => {
      setHasLoaded(true);
    });
  }, [loadSettingsFromDrive]);

  useEffect(() => {
    if (hasLoaded) {
      setLocalKey(geminiApiKey || '');
      setLocalCurrency(baseCurrency || 'INR');
    }
  }, [hasLoaded, geminiApiKey, baseCurrency]);

  async function handleSave() {
    setIsSaving(true);
    try {
      setGeminiApiKey(localKey);
      setBaseCurrency(localCurrency);
      await syncSettingsToDrive();
      toast.success('SETTINGS_COMMITTED_TO_CLOUD');
    } catch (e) {
      toast.error('SYNC_FAILED_CHECK_AUTH');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleWipeout() {
    if (wipeoutConfirmation !== 'WIPEOUT') return;
    setIsWipingOut(true);
    try {
      await wipeoutData();
      toast.success('SYSTEM_WIPED_SUCCESSFULLY');
      setIsWipeoutModalOpen(false);
      setWipeoutConfirmation('');
    } catch (e) {
      toast.error('WIPEOUT_FAILED');
    } finally {
      setIsWipingOut(false);
    }
  }

  return (
    <DashboardChrome>
      <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen bg-[#000000]">
        {/* Header section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-black tracking-tighter text-white uppercase leading-none">
              NEO_LEDGER
            </h1>
            <Badge className="rounded-none border-0 bg-[#FF00FF] px-3 py-1 text-[10px] font-black tracking-widest text-black">
              SYS_ROOT
            </Badge>
          </div>

          <div className="flex flex-1 items-center justify-center max-w-xl">
             <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-[#BBFF00]" />
                <input 
                  type="text" 
                  placeholder="[ CMD_FIND... ]"
                  className="w-full bg-[#121212] border-2 border-white/10 py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest text-white outline-none focus:border-[#BBFF00] transition-colors"
                />
             </div>
          </div>

          <div className="flex items-center gap-6 text-white/40">
            <Bell className="size-5 hover:text-white cursor-pointer" />
            <Monitor className="size-5 hover:text-white cursor-pointer" />
            <User className="size-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Configuration area */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="border-2 border-white/10 bg-[#050505] p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black tracking-[0.2em] text-[#BBFF00] uppercase">
                  CONFIGURATION_MANIFEST / SYS.CONFIG
                </h2>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#00FFFF] uppercase">
                  [LIVE_SYNC_ENABLED]
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed tracking-wide text-white/60 font-mono">
                System-wide variables for the AI parsing engine. Caution: Altering sensitivity values may lead to high variance in ledger reconciliation. API keys are encrypted and stored in your Google Drive AppData folder.
              </p>
            </div>

            {/* API KEYS Section */}
            <div className="border-2 border-[#FF00FF] bg-[#050505] p-8 shadow-[8px_8px_0px_0px_rgba(255,0,255,0.2)]">
               <div className="flex items-center gap-3 mb-10">
                  <Key className="size-6 text-[#FF00FF]" />
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">API_KEYS</h2>
               </div>
               
               <ApiKeyInput 
                 label="GOOGLE_AI_STUDIO_GEMINI_KEY" 
                 value={localKey}
                 onChange={setLocalKey}
                 placeholder="ENTER_GEMINI_API_KEY_FROM_AI_STUDIO"
               />
               
               <ApiKeyInput 
                 label="OPEN_AI_ENDPOINT_TOKEN (LEGACY)" 
                 value=""
                 onChange={() => {}}
                 placeholder="SK-.........................................."
               />
            </div>

            {/* Base Currency Section */}
            <div className="border-2 border-[#00FFFF] bg-[#050505] p-8 shadow-[8px_8px_0px_0px_rgba(0,255,255,0.2)]">
               <div className="flex items-center gap-3 mb-6">
                  <Coins className="size-6 text-[#00FFFF]" />
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">BASE_CURRENCY</h2>
               </div>
               <div className="flex gap-4 flex-wrap">
                 {['INR', 'USD', 'EUR', 'GBP', 'JPY'].map(cur => (
                   <button
                     key={cur}
                     onClick={() => setLocalCurrency(cur)}
                     className={`px-6 py-2 border-2 font-bold tracking-widest transition-colors ${
                       localCurrency === cur
                         ? 'border-[#00FFFF] bg-[#00FFFF] text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                         : 'border-white/20 text-white hover:border-[#00FFFF]'
                     }`}
                   >
                     {cur}
                   </button>
                 ))}
               </div>
            </div>

            {/* AI Threshold Section */}
            <div className="border-2 border-[#BBFF00] bg-[#050505] p-8 shadow-[8px_8px_0px_0px_rgba(187,255,0,0.2)]">
               <div className="flex items-center gap-3 mb-10">
                  <BrainCircuit className="size-6 text-[#BBFF00]" />
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">AI_THRESHOLD_SENSITIVITY</h2>
               </div>

               <SensitivitySlider 
                 label="PARSING_AGGRESSION"
                 initialValue={0.82}
                 description="Determines how strictly the AI categorizes ambiguous merchant names."
               />
               <SensitivitySlider 
                 label="FUZZY_MATCH_CONFIDENCE"
                 initialValue={0.45}
                 description="Lower values increase matching speed but decrease classification accuracy."
               />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="border-2 border-white bg-[#050505] p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
               <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <Monitor className="size-4 text-white/40" />
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">UI_GLITCH_EFFECTS</h3>
               </div>
               <GlitchSwitch label="CRT_SCANLINES" initialState={true} />
               <GlitchSwitch label="RGB_SHIFT_ON_HOVER" initialState={false} />
               <GlitchSwitch label="TERMINAL_CURSOR_BLINK" initialState={true} />
            </div>

            <SystemHealth />

            {/* Wipeout Section */}
            <div className="border-2 border-[#FF0000] bg-[#121212] p-6 shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]">
               <div className="flex items-center gap-3 mb-4 border-b border-[#FF0000]/30 pb-4">
                  <Activity className="size-4 text-[#FF0000]" />
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF0000] uppercase">DATA_DESTRUCTION</h3>
               </div>
               <p className="text-[10px] font-medium text-white/60 mb-6">
                 Warning: This action is irreversible. All historical transactions and manifest data will be permanently purged.
               </p>
               <Button 
                 onClick={() => setIsWipeoutModalOpen(true)}
                 className="w-full rounded-none border-2 border-[#FF0000] bg-black text-[#FF0000] hover:bg-[#FF0000] hover:text-black transition-colors text-[10px] font-black tracking-widest uppercase py-6"
               >
                 INITIATE_WIPEOUT
               </Button>
            </div>

            <div className="relative border-2 border-white/10 bg-black aspect-video overflow-hidden group">
               <Image 
                 src="/hardware_visualizer_rack_1778782900509.png" 
                 alt="Hardware Visualizer" 
                 fill 
                 className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
               />
               <div className="absolute bottom-4 left-4 border-2 border-white bg-black px-3 py-1.5 text-[8px] font-black tracking-[0.2em] text-white uppercase">
                 HARDWARE_VISUALIZER
               </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full rounded-none border-2 border-white bg-white py-8 text-sm font-black tracking-[0.3em] text-black hover:bg-[#BBFF00] hover:border-[#BBFF00] transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase"
            >
              {isSaving ? 'SYNCING_TO_DRIVE...' : 'COMMIT_ALL_CHANGES'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold tracking-[0.1em] text-white/30 uppercase font-mono">
            <div>© 2026 NEO_LEDGER_CORP   ENCRYPTION: AES-256-GCM   UPTIME: 99.998%</div>
            <div className="flex gap-4">
               <div className="h-3 w-3 bg-[#BBFF00]" />
               <div className="h-3 w-3 bg-[#FF00FF]" />
               <div className="h-3 w-3 bg-[#00FFFF]" />
            </div>
          </div>
        </footer>
      </div>

      {isWipeoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border-4 border-[#FF0000] bg-[#050505] p-8 shadow-[12px_12px_0px_0px_rgba(255,0,0,0.4)] relative">
            <button 
              onClick={() => {
                setIsWipeoutModalOpen(false);
                setWipeoutConfirmation('');
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white font-bold text-[10px] tracking-widest"
            >
              [ ABORT ]
            </button>
            
            <h2 className="text-2xl font-black text-[#FF0000] tracking-tighter mb-4 animate-pulse uppercase">
              WARNING: TOTAL DATA DESTRUCTION
            </h2>
            
            <p className="text-sm font-medium text-white/70 font-mono mb-8">
              You are about to purge all ledger entries and zero-out the system manifest. 
              Type <strong className="text-white bg-[#FF0000] px-1">WIPEOUT</strong> below to confirm your intent.
            </p>
            
            <input
              type="text"
              value={wipeoutConfirmation}
              onChange={(e) => setWipeoutConfirmation(e.target.value)}
              placeholder="TYPE WIPEOUT"
              className="w-full bg-black border-2 border-[#FF0000]/50 p-4 text-center text-xl font-black tracking-widest text-[#FF0000] outline-none focus:border-[#FF0000] uppercase mb-8"
            />
            
            <Button
              onClick={handleWipeout}
              disabled={wipeoutConfirmation !== 'WIPEOUT' || isWipingOut}
              className={`w-full rounded-none border-2 py-6 text-sm font-black tracking-[0.2em] uppercase transition-all ${
                wipeoutConfirmation === 'WIPEOUT' && !isWipingOut
                  ? 'border-[#FF0000] bg-[#FF0000] text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                  : 'border-white/20 bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {isWipingOut ? 'PURGING_SYSTEM...' : 'CONFIRM_DESTRUCTION'}
            </Button>
          </div>
        </div>
      )}
    </DashboardChrome>
  );
}
