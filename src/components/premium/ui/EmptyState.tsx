'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Search, Star } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-products' | 'no-results' | 'no-wishlist' | 'no-reviews' | 'empty-cart';
  message?: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const emptyStates = {
  'no-products': {
    icon: ShoppingBag,
    defaultMessage: 'No Products Available',
    defaultSubMessage: 'Explore our amazing collections and find your perfect style.',
    defaultAction: 'Browse Collections',
  },
  'no-results': {
    icon: Search,
    defaultMessage: 'No Products Found',
    defaultSubMessage: "Try adjusting your filters or search terms to find what you're looking for.",
    defaultAction: 'Clear Filters',
  },
  'no-wishlist': {
    icon: Heart,
    defaultMessage: 'Your Wishlist is Empty',
    defaultSubMessage: 'Start adding your favorite pieces to your wishlist.',
    defaultAction: 'Start Shopping',
  },
  'no-reviews': {
    icon: Star,
    defaultMessage: 'No Reviews Yet',
    defaultSubMessage: 'Be the first to share your experience with this product!',
    defaultAction: 'Write a Review',
  },
  'empty-cart': {
    icon: ShoppingBag,
    defaultMessage: 'Your Cart is Empty',
    defaultSubMessage: 'Discover beautiful fashion pieces and add them to your cart.',
    defaultAction: 'Continue Shopping',
  },
};

export function EmptyState({
  type,
  message,
  subMessage,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const state = emptyStates[type];
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
          <Icon size={40} className="text-pink-600" />
        </div>
      </motion.div>

      <h3 className="text-2xl font-bold text-neutral-900 mb-2">
        {message || state.defaultMessage}
      </h3>

      <p className="text-neutral-600 max-w-md mb-6">
        {subMessage || state.defaultSubMessage}
      </p>

      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          {actionLabel || state.defaultAction}
        </motion.button>
      )}
    </motion.div>
  );
}

interface NoDataProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function NoData({ title, description, icon }: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && <p className="text-neutral-600 text-sm">{description}</p>}
    </div>
  );
}

export function LoadingGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="bg-neutral-200 rounded-2xl aspect-square animate-shimmer" />
          <div className="space-y-2">
            <div className="bg-neutral-200 h-4 rounded w-3/4 animate-shimmer" />
            <div className="bg-neutral-200 h-3 rounded w-1/2 animate-shimmer" />
            <div className="bg-neutral-200 h-5 rounded w-1/3 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
