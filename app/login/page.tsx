'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { extractErrorMessage } from '@/lib/api-client';
import { setTokenPair } from '@/lib/token-storage';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/auth-slice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await authService.login(email, password);
      setTokenPair(tokens);
      const profile = await usersService.me();
      dispatch(setUser(profile));
      router.push('/dashboard');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-stone-500">Track your school&apos;s referral network.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-stone-500">
          Setting up a new school?{' '}
          <Link href="/onboarding" className="text-primary underline-offset-4 hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
