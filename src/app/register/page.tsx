import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-background p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
             <span className="font-heading font-bold text-3xl">LUXE</span>
          </Link>
          <h2 className="text-center font-heading text-2xl font-extrabold text-foreground">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join us to track orders, save wishlists, and receive exclusive offers.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
