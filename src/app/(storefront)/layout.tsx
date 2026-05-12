import React from 'react';
import { CartSheet } from '@/components/storefront/CartSheet';

// Compute once at module level to stay stable across SSR/hydration
const CURRENT_YEAR = new Date().getFullYear();

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Storefront Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center mx-auto px-4">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-heading font-bold text-2xl sm:inline-block">
                LUXE
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/shop">Shop</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/collections">Collections</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/new-arrivals">New Arrivals</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/sale">Sale</a>
            </nav>
          </div>
          {/* Mobile Nav would go here */}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search component */}
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/wishlist" className="text-foreground/60 hover:text-foreground transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </a>
              <CartSheet />
              <a href="/login" className="text-foreground/60 hover:text-foreground transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Storefront Footer */}
      <footer className="border-t py-12 bg-muted/40">
        <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">LUXE</h3>
            <p className="text-sm text-muted-foreground">
              Elevating women's fashion with elegant, premium, and sustainable clothing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/shop">All Products</a></li>
              <li><a href="/collections">Collections</a></li>
              <li><a href="/sale">Sale</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/returns">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-2">Subscribe to receive updates, access to exclusive deals, and more.</p>
            {/* Newsletter input form */}
          </div>
        </div>
        <div className="container px-4 mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {CURRENT_YEAR} Luxe Boutique. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
