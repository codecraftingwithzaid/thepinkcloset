import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Go Back to Website Button */}
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Website</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </Link>

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
