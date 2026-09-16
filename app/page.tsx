'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRefreshToken } from '@/lib/token-storage';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getRefreshToken() ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
