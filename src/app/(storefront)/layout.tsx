import React from 'react';
import '@/styles/premium-theme.css';
import { PremiumFooter, PremiumHeader } from '@/components/premium';

export const dynamic = 'force-dynamic';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="storefront-scope flex min-h-screen flex-col bg-[var(--color-neutral-cream)] text-[var(--color-neutral-dark)]">
      <PremiumHeader />
      <main className="flex-1">{children}</main>
      <PremiumFooter />
    </div>
  );
}
