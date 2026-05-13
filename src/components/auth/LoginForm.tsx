'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { FullScreenLoader } from '@/components/loaders';
import { startGlobalLoading, stopGlobalLoading } from '@/store/useLoadingStore';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    startGlobalLoading('Signing in...')
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        stopGlobalLoading()
      } else {
        await router.push('/admin'); // Redirect to admin for now, or depending on role
        router.refresh();
        // Route change listener in RootLayoutClient will stop loader
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
      stopGlobalLoading()
    }
  };

  return (
    <>
      {/* FullScreenLoader is shown globally via RootLayoutClient when global loading is active */}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-busy={isLoading}>
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email-address">Email address</Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="admin@example.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="h-12 w-full rounded-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>

        <div className="mt-4 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create New Account
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/forgot-password" className="font-medium text-primary hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
