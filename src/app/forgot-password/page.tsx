'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mocking email send delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Reset link sent to your email.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-background p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
             <span className="font-heading font-bold text-3xl">LUXE</span>
          </Link>
          <h2 className="text-center font-heading text-2xl font-extrabold text-foreground">
            Reset Password
          </h2>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              We've sent a password reset link to your email address. Please check your inbox and spam folder.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-full h-12">Return to Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-address">Email address</Label>
                  <Input id="email-address" name="email" type="email" required className="mt-1" placeholder="jane@example.com" />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full h-12 rounded-full" disabled={isLoading}>
                  {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
