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

function normalizeParsedTransaction(payload: unknown): ParsedTransaction {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    return {
      amount: (record.amount as number | string | undefined) ?? (record.total as number | string | undefined),
      currency: (record.currency as string | undefined) ?? (record.ccy as string | undefined),
      category: (record.category as string | undefined) ?? (record.category_name as string | undefined),
      vendor: (record.vendor as string | undefined) ?? (record.merchant as string | undefined),
      date: (record.date as string | undefined) ?? (record.timestamp as string | undefined),
      raw: payload,
    };
  }

  return { raw: payload };
}

import { db } from '../services/db.service';
import { useSync } from '../hooks/useSync';

export function CommandCenter() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { sync } = useSync();

  const [status, setStatus] = useState<CommandCenterStatus>('idle');
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const isBusy = status === 'processing';
  const canSubmit = useMemo(() => input.trim().length > 0 && !isBusy, [input, isBusy]);

  async function handleLogToLedger() {
    if (!parsed) return;
    try {
      await db.expenses.add({
        amount: Number(parsed.amount) || 0,
        currency: parsed.currency || 'USD',
        category: (parsed.category || 'MISC').toString().toUpperCase(),
        vendor: parsed.vendor || 'UNKNOWN',
        date: new Date().toISOString(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      sync();
      resetToIdle();
      setInput('');
    } catch (e) {
      setError('FAILED_TO_LOG_TO_INDEXEDDB');
    }
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    setError(null);
    setStatus('processing');
    setParsed(null);

    // MOCK PARSE for local-first testing
    setTimeout(() => {
      const amountMatch = input.match(/\d+/);
      const vendor = input.split(' ').pop() || 'VENDOR';
      setParsed({
        amount: amountMatch ? amountMatch[0] : 0,
        currency: 'USD',
        category: 'MISC',
        vendor: vendor,
        date: new Date().toISOString()
      });
      setStatus('review');
    }, 1000);
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
        <div className="relative">
          <Textarea
            id="command-center-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`ENTER TRANSACTION (E.G. '50 CREDITS FOR RAMEN AT SECTOR 7')`}
            rows={3}
            className={([
              'w-full resize-none bg-transparent p-4 text-white placeholder:text-white/35',
              'rounded-none border-2 border-white',
              'shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              'transition-colors',
              status === 'processing' ? 'border-[#BBFF00]' : 'focus-visible:border-[#BBFF00]',
            ]).join(' ')}
            aria-describedby={error ? 'command-center-error' : undefined}
            disabled={isBusy}
          />

          {status === 'processing' ? (
            <div className="pointer-events-none absolute left-0 top-0 h-1 w-full overflow-hidden">
              <div className="h-full w-full bg-[#BBFF00] animate-pulse" />
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit}
          className={([
            'fixed bottom-[clamp(1rem,5vw,2rem)] right-[clamp(1rem,5vw,2rem)] z-50',
            'w-auto rounded-none border-2 border-white px-[clamp(1.25rem,4vw,2rem)] py-[clamp(0.75rem,3vw,1.25rem)]',
            'text-[clamp(0.875rem,4vw,1.25rem)] font-black tracking-tight md:text-xl',
            'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            canSubmit
              ? 'bg-[#BBFF00] text-black hover:bg-[#BBFF00] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              : 'bg-[#BBFF00]/40 text-black/40 cursor-not-allowed hover:bg-[#BBFF00]/40',
          ]).join(' ')}
        >
          <span className="inline-flex items-center justify-center gap-2 sm:gap-3">
            <Zap className="size-[clamp(1rem,4vw,1.5rem)]" />
            <span className="whitespace-nowrap uppercase leading-tight">
              TRACK TRANSACTION
            </span>
          </span>
        </Button>

        {error ? (
          <div
            id="command-center-error"
            className="border-2 border-[#FF00FF] bg-[#FF00FF]/10 p-3 text-[12px] font-bold tracking-[0.08em] text-[#FF00FF]"
          >
            {error}
          </div>
        ) : null}
      </div>

      {status === 'review' && parsed ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Card className="rounded-none border-2 border-white bg-[#121212] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-3 sm:p-4">
              <div className="text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/60">
                AMOUNT
              </div>
              <div className="mt-2 text-[clamp(1.375rem,6vw,1.875rem)] font-black tracking-tight">
                {String(parsed.amount ?? '—')}{' '}
                <span className="text-white/60 text-base sm:text-lg">
                  {parsed.currency ?? ''}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 border-white bg-[#121212] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-3 sm:p-4">
              <div className="text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/60">
                CATEGORY
              </div>
              <Badge
                className="mt-3 rounded-none border-2 border-white bg-[#FF00FF] px-3 py-1 text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-black"
              >
                {(parsed.category ?? 'UNCLASSIFIED').toString().toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 border-white bg-[#121212] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-3 sm:p-4">
              <div className="text-[clamp(9px,2.5vw,10px)] font-bold tracking-widest text-white/60">
                VENDOR
              </div>
              <div className="mt-2 wrap-break-word text-[clamp(1.125rem,5vw,1.5rem)] font-black tracking-tight uppercase">
                {parsed.vendor ?? '—'}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 border-white bg-[#121212] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:col-span-2">
            <CardContent className="p-3 sm:p-4">
              <Button
                type="button"
                onClick={handleLogToLedger}
                className="mt-3 w-full rounded-none border-2 border-black bg-[#BBFF00] px-4 py-3 text-[clamp(10px,2.8vw,12px)] font-black tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#BBFF00] focus-visible:ring-0 focus-visible:ring-offset-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                LOG TO LEDGER
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

