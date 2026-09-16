'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { schoolsService } from '@/services/schools.service';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { extractErrorMessage } from '@/lib/api-client';
import { setTokenPair } from '@/lib/token-storage';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/auth-slice';

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleCreateSchool(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const school = await schoolsService.createSchool(schoolName);
      setSchoolId(school.id);
      setStep(2);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAdmin(event: FormEvent) {
    event.preventDefault();
    if (!schoolId) return;
    setError(null);
    setLoading(true);
    try {
      await schoolsService.createRootUser(schoolId, name, email, password);
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
        <p className="text-sm text-stone-500">Step {step} of 2</p>
        <h1 className="mt-1 font-serif text-2xl text-ink">
          {step === 1 ? 'Set up your school' : 'Add yourself as the first member'}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {step === 1
            ? 'Every referral starts from a school.'
            : `You'll be the root of ${schoolName}'s referral tree.`}
        </p>

        {error && (
          <div className="mt-4">
            <Alert variant="destructive">{error}</Alert>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleCreateSchool} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schoolName">School name</Label>
              <Input
                id="schoolName"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Green Valley School"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Creating…' : 'Continue'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCreateAdmin} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-stone-400">At least 8 characters.</p>
            </div>
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Finishing…' : 'Finish setup'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
