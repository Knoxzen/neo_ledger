import { useSession, signIn, signOut } from 'next-auth/react';
import { useAppStore } from '../store/useAppStore';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const { setAuth, isLoggedIn, user } = useAppStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setAuth({
        isLoggedIn: true,
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        } as any,
        accessToken: (session as any).accessToken,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
    } else if (status === 'unauthenticated') {
      setAuth({ isLoggedIn: false, user: null, accessToken: null, expiresAt: 0 });
    }
  }, [status, session, setAuth]);

  return {
    isLoggedIn: status === 'authenticated',
    user: session?.user || null,
    status,
    login: () => signIn('google'),
    logout: () => signOut({ callbackUrl: '/' }),
  };
}
