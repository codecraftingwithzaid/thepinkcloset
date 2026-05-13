import React from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { auth } from '@/auth';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Welcome back, {session?.user?.name || 'Customer'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 text-foreground font-medium transition-colors hover:bg-muted"
            >
              <User className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              My Orders
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Profile Settings
            </Link>
            <LogoutButton
              className="mt-8 flex items-center gap-3 rounded-lg px-4 py-3 text-red-500 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </LogoutButton>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
