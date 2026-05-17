'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';

// --- SCHEMAS ---
const TransactionSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  merchant: z.string(),
  amount: z.number(),
  currency: z.string(),
  class: z.enum(['DINING', 'FASHION', 'TECH', 'TRAVEL', 'ENTERTAINMENT', 'MISC']),
  status: z.string(),
  meta: z.object({
    raw_input: z.string()
  }).optional()
});

const ManifestSchema = z.object({
  total_burn: z.number(),
  burn_rate: z.number(),
  threat_level: z.string(),
  last_updated: z.string()
});

type Transaction = z.infer<typeof TransactionSchema>;
type Manifest = z.infer<typeof ManifestSchema>;

interface TerminalState {
  manifest: Manifest;
  ledgerHistory: Transaction[];
  settings: any;
  isHydrated: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  error: string | null;
}

interface TerminalContextType extends TerminalState {
  logTransaction: (input: string, apiKey?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TerminalDataContext = createContext<TerminalContextType | undefined>(undefined);

const STORAGE_KEY = 'TERMINAL_01_CACHE';

const INITIAL_MANIFEST: Manifest = {
  total_burn: 0,
  burn_rate: 0,
  threat_level: 'STABLE',
  last_updated: new Date().toISOString()
};

export function TerminalDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { baseCurrency } = useAppStore();
  const [state, setState] = useState<TerminalState>({
    manifest: INITIAL_MANIFEST,
    ledgerHistory: [],
    settings: {},
    isHydrated: false,
    isSyncing: false,
    lastSyncTime: null,
    error: null,
  });

  // 1. Hydrate from Cache
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setState(prev => ({ ...prev, ...parsed, isHydrated: true }));
      } catch (e) {
        console.error('CACHE_HYDRATION_FAILED');
      }
    }
  }, []);

  // 2. Sync with Drive when session is ready
  useEffect(() => {
    if (status === 'authenticated' && (session as any)?.accessToken) {
      fetchInitialData();
    }
  }, [status, (session as any)?.accessToken]);

  const fetchInitialData = useCallback(async () => {
    const token = (session as any)?.accessToken;
    if (!token) return;

    setState(prev => ({ ...prev, isSyncing: true }));
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`
      };

      const res = await fetch('/api/batch', { headers });
      if (!res.ok) throw new Error('FETCH_FAILED');
      
      const data = await res.json();
      const newState = {
        manifest: data.manifest || INITIAL_MANIFEST,
        ledgerHistory: data.ledger || [],
        settings: data.settings || {},
        lastSyncTime: Date.now(),
        isHydrated: true,
        isSyncing: false,
        error: null,
      };

      setState(prev => ({ ...prev, ...newState }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (err: any) {
      setState(prev => ({ ...prev, isSyncing: false, error: err.message }));
    }
  }, [session?.accessToken]);

  const logTransaction = useCallback(async (input: string, apiKey?: string) => {
    // 1. Capture Snapshot for Rollback
    const snapshot = { ...state };
    
    // 2. Simple regex heuristic for "0ms" optimistic update
    // e.g. "spent 40 on lunch" -> 40
    const amountMatch = input.match(/(\d+(?:\.\d+)?)/);
    const estimatedAmount = amountMatch ? parseFloat(amountMatch[1]) : 0;

    // IMMEDIATE OPTIMISTIC UI UPDATE
    setState(prev => {
      const tempEntry: Transaction = {
        id: `TEMP_${Date.now()}`,
        timestamp: new Date().toISOString(),
        merchant: "PROCESSING...",
        amount: estimatedAmount,
        currency: baseCurrency || "INR",
        class: "MISC",
        status: "PENDING_SYNC"
      };

      const updated = {
        ...prev,
        manifest: {
          ...prev.manifest,
          total_burn: prev.manifest.total_burn + estimatedAmount,
        },
        ledgerHistory: [tempEntry, ...prev.ledgerHistory],
        isSyncing: true
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const token = (session as any)?.accessToken;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (apiKey) headers['x-gemini-api-key'] = apiKey;
      headers['x-base-currency'] = baseCurrency || 'INR';

      // FETCH PARSED DATA (GEMINI)
      const parseRes = await fetch('/api/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: input, action: 'fetch' }),
      });

      const data = await parseRes.json().catch(() => ({}));

      if (!parseRes.ok) {
        console.error('PARSE_API_ERROR:', data);
        throw new Error(data.error || 'PARSE_FAILED');
      }
      const entry: Transaction = data;

      // RE-CALIBRATE WITH REAL DATA
      setState(prev => {
        // Remove the temp entry and add the real one
        const newHistory = [entry, ...prev.ledgerHistory.filter(h => !h.id.startsWith('TEMP_'))];
        
        // Correct the manifest (subtract estimate, add real)
        const newManifest = {
          ...prev.manifest,
          total_burn: prev.manifest.total_burn - estimatedAmount + entry.amount,
          last_updated: new Date().toISOString()
        };
        
        const updated = {
          ...prev,
          manifest: newManifest,
          ledgerHistory: newHistory,
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // BACKGROUND SAVE (Non-blocking)
      fetch('/api/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: entry, action: 'save' }),
      }).then(res => {
        if (!res.ok) throw new Error('SAVE_FAILED');
        setState(prev => ({ ...prev, isSyncing: false }));
      }).catch(err => {
        console.error('BG_SAVE_FAILED:', err);
        setState(prev => ({ ...prev, error: 'ERROR_SYNC_FAILED', isSyncing: false }));
      });

    } catch (err: any) {
      console.error('SYNC_ERROR:', err);
      // ROLLBACK
      setState(snapshot);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setState(prev => ({ ...prev, error: 'ERROR_SYNC_FAILED', isSyncing: false }));
    }
  }, [state, session?.accessToken]);

  const value = useMemo(() => ({
    data: {
      manifest: state.manifest,
      history: state.ledgerHistory,
      settings: state.settings,
    },
    isLoading: state.isSyncing,
    ...state,
    logTransaction,
    refreshData: fetchInitialData
  }), [state, logTransaction, fetchInitialData]);

  return (
    <TerminalDataContext.Provider value={value}>
      {children}
    </TerminalDataContext.Provider>
  );
}

export function useTerminalData() {
  const context = useContext(TerminalDataContext);
  if (context === undefined) {
    throw new Error('useTerminalData must be used within a TerminalDataProvider');
  }
  return context;
}
