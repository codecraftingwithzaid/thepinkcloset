import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-background p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-center font-heading text-3xl font-extrabold text-foreground">
            Sign in to Luxe
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or create a new account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
