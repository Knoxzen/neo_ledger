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
