'use client';

import React from 'react';
import { Search, Bell, Monitor, User, Key, BrainCircuit, Activity, Cpu } from 'lucide-react';
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

export default function SettingsPage() {
  const { geminiApiKey, setGeminiApiKey, syncSettingsToDrive, loadSettingsFromDrive } = useAppStore();
  const [localKey, setLocalKey] = useState(geminiApiKey || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettingsFromDrive().then(() => {
      setLocalKey(useAppStore.getState().geminiApiKey || '');
    });
  }, [loadSettingsFromDrive]);

  async function handleSave() {
    setIsSaving(true);
    try {
      setGeminiApiKey(localKey);
      await syncSettingsToDrive();
      toast.success('SETTINGS_COMMITTED_TO_CLOUD');
    } catch (e) {
      toast.error('SYNC_FAILED_CHECK_AUTH');
    } finally {
      setIsSaving(false);
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
            <div>© 2024 NEO_LEDGER_CORP   ENCRYPTION: AES-256-GCM   UPTIME: 99.998%</div>
            <div className="flex gap-4">
               <div className="h-3 w-3 bg-[#BBFF00]" />
               <div className="h-3 w-3 bg-[#FF00FF]" />
               <div className="h-3 w-3 bg-[#00FFFF]" />
            </div>
          </div>
        </footer>
      </div>
    </DashboardChrome>
  );
}
