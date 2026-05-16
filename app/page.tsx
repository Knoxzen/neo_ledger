'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/components/LoginScreen';
import { SystemLoader } from '@/components/SystemLoader';

export default function Home() {
  const { isLoggedIn, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return <SystemLoader />;
  }

  return <LoginScreen />;
}
