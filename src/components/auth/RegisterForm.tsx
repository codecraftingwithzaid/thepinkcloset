'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/actions/auth';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
      toast.error('Registration failed', { description: res.error });
      setIsLoading(false);
    } else {
      toast.success('Account created!', { description: 'Please log in with your new credentials.' });
      router.push('/login');
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required className="mt-1" placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="email-address">Email address</Label>
          <Input id="email-address" name="email" type="email" required className="mt-1" placeholder="jane@example.com" />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" name="mobile" type="tel" className="mt-1" placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="mt-1" placeholder="••••••••" minLength={6} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required className="mt-1" placeholder="••••••••" minLength={6} />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full h-12 rounded-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
