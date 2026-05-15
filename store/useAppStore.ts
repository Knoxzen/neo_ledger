// store/useAppStore.ts

import { create } from 'zustand';
import { GoogleUser, AuthState } from '../types/auth';

interface AppStore {
  isLoggedIn: boolean;
  user: GoogleUser | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastBackupAt: number | null;
  geminiApiKey: string | null;
  setAuth: (auth: AuthState) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  setLastBackupAt: (time: number) => void;
  setGeminiApiKey: (key: string | null) => void;
  syncSettingsToDrive: () => Promise<void>;
  loadSettingsFromDrive: () => Promise<void>;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isLoggedIn: false,
  user: null,
  syncStatus: 'idle',
  lastBackupAt: null,
  geminiApiKey: null,
  setAuth: (auth) => set({ isLoggedIn: auth.isLoggedIn, user: auth.user }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastBackupAt: (time) => set({ lastBackupAt: time }),
  setGeminiApiKey: (key) => set({ geminiApiKey: key }),
  syncSettingsToDrive: async () => {
    const { geminiApiKey } = get();
    const auth = localStorage.getItem('NEO_AUTH');
    const token = auth ? JSON.parse(auth).accessToken : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers,
      body: JSON.stringify({ geminiApiKey }),
    });
    if (!res.ok) throw new Error('SETTINGS_SYNC_FAILED');
  },
  loadSettingsFromDrive: async () => {
    try {
      const auth = localStorage.getItem('NEO_AUTH');
      const token = auth ? JSON.parse(auth).accessToken : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/settings', { headers });
      if (!res.ok) return;
      const config = await res.json();
      if (config?.geminiApiKey) {
        set({ geminiApiKey: config.geminiApiKey });
      }
    } catch (e) {
      console.error('SETTINGS_LOAD_FAILED');
    }
  },
  logout: () => set({ isLoggedIn: false, user: null, geminiApiKey: null }),
}));
