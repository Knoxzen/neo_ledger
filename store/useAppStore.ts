// store/useAppStore.ts

import { create } from 'zustand';
import { GoogleUser, AuthState } from '../types/auth';

export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  DINING: '#BBFF00',
  FASHION: '#FF00FF',
  TECH: '#00FFFF',
  TRAVEL: '#FFFFFF',
  ENTERTAINMENT: '#7000FF',
  MISC: '#888888',
  GROCERIES: '#FF8800',
  TRANSPORT: '#00AAFF',
  UTILITIES: '#FFFF00',
  HEALTH: '#FF0055',
  HOUSING: '#00FF88',
};

interface AppStore {
  isLoggedIn: boolean;
  user: GoogleUser | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastBackupAt: number | null;
  geminiApiKey: string | null;
  baseCurrency: string;
  categoryColors: Record<string, string>;
  setAuth: (auth: AuthState) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  setLastBackupAt: (time: number) => void;
  setGeminiApiKey: (key: string | null) => void;
  setBaseCurrency: (currency: string) => void;
  setCategoryColor: (category: string, color: string) => void;
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
  baseCurrency: 'INR',
  categoryColors: DEFAULT_CATEGORY_COLORS,
  setAuth: (auth) => {
    set({ isLoggedIn: auth.isLoggedIn, user: auth.user });
    if (auth.isLoggedIn && auth.accessToken) {
      localStorage.setItem('NEO_AUTH', JSON.stringify({
        accessToken: auth.accessToken,
        expiresAt: auth.expiresAt,
      }));
      // Set cookie for server-side Google Drive API access
      document.cookie = `neo_access_token=${auth.accessToken}; path=/; max-age=2592000; SameSite=Lax`;
    } else if (!auth.isLoggedIn) {
      localStorage.removeItem('NEO_AUTH');
    }
  },
  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastBackupAt: (time) => set({ lastBackupAt: time }),
  setGeminiApiKey: (key) => set({ geminiApiKey: key }),
  setBaseCurrency: (currency) => set({ baseCurrency: currency }),
  setCategoryColor: (category, color) => set((state) => ({
    categoryColors: { ...state.categoryColors, [category]: color }
  })),
  syncSettingsToDrive: async () => {
    const { geminiApiKey, baseCurrency, categoryColors } = get();
    const auth = localStorage.getItem('NEO_AUTH');
    const token = auth ? JSON.parse(auth).accessToken : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers,
      body: JSON.stringify({ geminiApiKey, baseCurrency, categoryColors }),
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
      if (config?.baseCurrency) {
        set({ baseCurrency: config.baseCurrency });
      }
      if (config?.categoryColors) {
        set((state) => ({ categoryColors: { ...state.categoryColors, ...config.categoryColors } }));
      }
    } catch (e) {
      console.error('SETTINGS_LOAD_FAILED');
    }
  },
  logout: () => {
    localStorage.removeItem('NEO_AUTH');
    document.cookie = "nextauth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    set({ isLoggedIn: false, user: null, geminiApiKey: null, baseCurrency: 'INR', categoryColors: DEFAULT_CATEGORY_COLORS });
  },
}));
