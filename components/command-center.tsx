'use client';

import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { BrainCircuit, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type CommandCenterStatus = 'idle' | 'processing' | 'review';

interface ParsedTransaction {
  amount?: number | string;
  currency?: string;
  category?: string;
  vendor?: string;
  date?: string;
  raw?: unknown;
}


import { db } from '../services/db.service';
import { useTerminalData } from '../hooks/useTerminalData';
import { useAppStore } from '@/store/useAppStore';

export function CommandCenter({ onTrackSuccess }: { onTrackSuccess?: () => void }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { logTransaction } = useTerminalData();
  const { geminiApiKey } = useAppStore();

  const [status, setStatus] = useState<CommandCenterStatus>('idle');
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const isBusy = status === 'processing';
  const canSubmit = useMemo(() => input.trim().length > 0 && !isBusy, [input, isBusy]);


  async function handleSubmit() {
    if (!canSubmit) return;

    setError(null);
    setStatus('processing');
    
    const currentInput = input;
    setInput(''); // Clear input immediately for next entry
    
    onTrackSuccess?.(); // Close the drawer immediately on track

    try {
      // The context handles optimistic update and background sync
      await logTransaction(currentInput, geminiApiKey || undefined);
      setStatus('idle');
    } catch (e: any) {
      setError(e.message || 'PROCESS_FAILED');
      setStatus('idle');
      setInput(currentInput); // Restore input on error
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    void handleSubmit();
  }

  function resetToIdle() {
    setStatus('idle');
    setParsed(null);
    setError(null);
    textareaRef.current?.focus();
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-2 top-2 select-none text-white/10 sm:right-4 sm:top-4">
        <BrainCircuit className="size-10 sm:size-14 lg:size-16" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor="command-center-input"
          className="block text-[12px] font-bold tracking-widest text-white/70"
        >
          INPUT_STREAM:
        </label>
        {status === 'processing' ? (
          <span className="text-[10px] font-bold tracking-widest text-[#BBFF00] animate-pulse">
            PROCESSING...
          </span>
        ) : status === 'review' ? (
          <button
            type="button"
            onClick={resetToIdle}
            className="text-[10px] font-bold tracking-widest text-[#FF00FF] hover:underline"
          >
            RESET
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-4">
        <div className="relative group">
          <Textarea
            id="command-center-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`ENTER TRANSACTION (E.G. '50 CREDITS FOR RAMEN AT SECTOR 7')`}
            rows={4}
            className={([
              'w-full resize-none bg-transparent p-4 pb-16 text-white placeholder:text-white/35',
              'rounded-none border-2 border-white',
              'shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              'transition-all duration-300',
              status === 'processing' ? 'border-[#BBFF00]' : 'focus-visible:border-[#BBFF00] focus-visible:bg-white/5',
            ]).join(' ')}
            aria-describedby={error ? 'command-center-error' : undefined}
            disabled={isBusy}
          />

          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit || status === 'review'}
            className={([
              'absolute bottom-3 right-3 z-10',
              'w-auto rounded-none border-2 border-black px-4 py-2.5',
              'text-sm font-bold tracking-tight',
              'transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
              canSubmit && status !== 'review'
                ? 'bg-[#BBFF00] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                : 'bg-white/10 text-white/20 cursor-not-allowed grayscale',
            ]).join(' ')}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Zap className={status === 'processing' ? 'animate-pulse' : ''} size={16} />
              <span className="whitespace-nowrap uppercase">
                {status === 'processing' ? 'PROCESSING' : 'TRACK'}
              </span>
            </span>
          </Button>

          {status === 'processing' ? (
            <div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-full overflow-hidden">
              <div className="h-full w-full bg-[#BBFF00] animate-[shimmer_2s_infinite_linear] bg-size-[200%_100%] bg-linear-to-r from-transparent via-white/50 to-transparent" />
            </div>
          ) : null}
        </div>



        {error ? (
          <div
            id="command-center-error"
            className="border-2 border-[#FF00FF] bg-[#FF00FF]/10 p-3 text-[12px] font-bold tracking-[0.08em] text-[#FF00FF]"
          >
            {error}
          </div>
        ) : null}
      </div>

    </div>
  );
}

