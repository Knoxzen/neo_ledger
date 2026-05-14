// types/db.ts

export interface Expense {
  id?: number;
  amount: number;
  currency: string;
  category: string;
  vendor: string;
  date: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  id?: number;
  category: string;
  limit: number;
  period: 'monthly' | 'yearly';
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
}

export interface SyncMetadata {
  id: 'current';
  lastSyncTime: number;
  driveFileId?: string;
  syncVersion: number;
}

// types/auth.ts

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: GoogleUser | null;
  accessToken: string | null;
  expiresAt: number | null;
}
