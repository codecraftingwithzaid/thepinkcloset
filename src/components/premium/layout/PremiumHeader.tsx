'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Search, Menu, X, ChevronDown, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface PremiumHeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  categories?: Array<{ id: string; name: string; slug: string }>;
  onSearchChange?: (query: string) => void;
}

export function PremiumHeader({
  cartCount = 0,
  wishlistCount = 0,
  categories = [],
  onSearchChange,
}: PremiumHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHoveringCategory, setIsHoveringCategory] = useState<string | null>(null);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items);
  const router = useRouter();
  const effectiveCartCount = cartCount || totalCartItems;
  const effectiveWishlistCount = wishlistCount || wishlistItems.length;
  const navCategories = categories.length > 0
    ? categories
    : [
        { id: 'shop', name: 'Shop', slug: '' },
        { id: 'collections', name: 'Collections', slug: 'collections' },
        { id: 'new', name: 'New Arrivals', slug: 'sort=new' },
        { id: 'journal', name: 'Journal', slug: 'journal' },
      ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      onSearchChange?.(searchQuery);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md luxury-shadow' : 'bg-white/90 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="font-display text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent"
              >
                PINK CLOSET
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navCategories.slice(0, 4).map((cat) => {
                const href = cat.id === 'collections'
                  ? '/collections'
                  : cat.id === 'journal'
                    ? '/blog'
                    : cat.slug.includes('=')
                      ? `/shop?${cat.slug}`
                      : cat.slug
                        ? `/shop?category=${cat.slug}`
                        : '/shop';

                return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setIsHoveringCategory(cat.id)}
                  onMouseLeave={() => setIsHoveringCategory(null)}
                  className="relative group"
                >
                  <Link
                    href={href}
                    className="flex items-center gap-1 text-neutral-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    {cat.name}
                    <ChevronDown size={16} className="opacity-50" />
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {isHoveringCategory === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-0 pt-2 hidden group-hover:block"
                      >
                        <div className="bg-white rounded-xl luxury-shadow min-w-48 p-4 space-y-2">
                          <Link href={`/shop?category=${cat.slug}`} className="block px-4 py-2 hover:bg-pink-50 rounded-lg transition-colors">
                            View All
                          </Link>
                          <hr className="border-neutral-100" />
                          <Link href={`/shop?category=${cat.slug}&sort=new`} className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 rounded-lg transition-colors">
                            New Arrivals
                          </Link>
                          <Link href={`/shop?category=${cat.slug}&sort=trending`} className="block px-4 py-2 text-sm text-neutral-600 hover:bg-pink-50 rounded-lg transition-colors">
                            Trending
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <div className="hidden sm:block relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-neutral-700 hover:text-pink-600 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </motion.button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      onSubmit={handleSearch}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl luxury-shadow p-4 z-50"
                    >
                      <input
                        type="text"
                        placeholder="Search for items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                        autoFocus
                      />
                      <p className="text-xs text-neutral-500 mt-2">Try searching by name, color, or style</p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-neutral-700 hover:text-pink-600 transition-colors">
                <Heart size={20} />
                {effectiveWishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {effectiveWishlistCount > 99 ? '99+' : effectiveWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-pink-600 transition-colors">
                <ShoppingBag size={20} />
                {effectiveCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {effectiveCartCount > 99 ? '99+' : effectiveCartCount}
                  </span>
                )}
              </Link>

              <Link href="/dashboard" className="hidden sm:block p-2 text-neutral-700 hover:text-pink-600 transition-colors" aria-label="My account">
                <User size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-700 hover:text-pink-600 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed left-0 right-0 top-20 bg-white/95 backdrop-blur-md z-30 md:hidden overflow-y-auto max-h-[calc(100vh-5rem)]"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.id === 'collections' ? '/collections' : cat.id === 'journal' ? '/blog' : cat.slug.includes('=') ? `/shop?${cat.slug}` : cat.slug ? `/shop?category=${cat.slug}` : '/shop'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-neutral-700 hover:bg-pink-50 rounded-lg transition-colors font-medium"
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="my-4 border-neutral-200" />
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-pink-400"
                  />
                </form>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
