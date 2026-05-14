// store/useAppStore.ts

import { create } from 'zustand';
import { GoogleUser, AuthState } from '../types/auth';

interface AppStore {
  isLoggedIn: boolean;
  user: GoogleUser | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastBackupAt: number | null;
  setAuth: (auth: AuthState) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  setLastBackupAt: (time: number) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoggedIn: false,
  user: null,
  syncStatus: 'idle',
  lastBackupAt: null,
  setAuth: (auth) => set({ isLoggedIn: auth.isLoggedIn, user: auth.user }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastBackupAt: (time) => set({ lastBackupAt: time }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
