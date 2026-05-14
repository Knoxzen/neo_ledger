// hooks/useAuth.ts

import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/auth.service';

export function useAuth() {
  const { setAuth, isLoggedIn, user } = useAppStore();

  useEffect(() => {
    const handleAuth = async (e: any) => {
      const userInfo = await authService.fetchUserInfo(e.detail.access_token);
      setAuth({ isLoggedIn: true, user: userInfo, accessToken: e.detail.access_token, expiresAt: Date.now() + 3600000 });
    };
    window.addEventListener('NEO_AUTH_SUCCESS', handleAuth);
    if (authService.isTokenValid()) {
      const stored = authService.getStoredToken();
      authService.fetchUserInfo(stored.accessToken).then(u => setAuth({ isLoggedIn: true, user: u, accessToken: stored.accessToken, expiresAt: stored.expiresAt }));
    }
    return () => window.removeEventListener('NEO_AUTH_SUCCESS', handleAuth);
  }, [setAuth]);

  return { isLoggedIn, user, login: () => authService.login(), logout: () => authService.logout() };
}
