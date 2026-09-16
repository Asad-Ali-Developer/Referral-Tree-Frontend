'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnauthenticated, setUser } from '@/store/auth-slice';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { getRefreshToken, setTokenPair } from '@/lib/token-storage';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Runs once per app load: an access token is never persisted, so on a
 * fresh page load we exchange the persisted refresh token for a new
 * access token, then fetch the caller's own profile to hydrate Redux.
 * If there's no refresh token, or it's no longer valid, the visitor is
 * sent to /login.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        if (!cancelled) dispatch(setUnauthenticated());
        return;
      }
      try {
        const tokens = await authService.refresh(refreshToken);
        setTokenPair(tokens);
        const profile = await usersService.me();
        if (!cancelled) dispatch(setUser(profile));
      } catch {
        if (!cancelled) dispatch(setUnauthenticated());
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'checking') {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
