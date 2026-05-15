'use client';

import React from 'react';
import { Heart, ShoppingBag, Zap } from 'lucide-react';

interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  onClick,
  className = '',
}: LuxuryButtonProps) {
  const baseStyles =
    'font-medium transition-all duration-300 rounded-lg font-poppins inline-flex items-center justify-center gap-2 cursor-pointer';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100 text-neutral-900 hover:shadow-lg hover:from-pink-400 hover:via-pink-300 hover:to-pink-200 active:scale-95',
    secondary:
      'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg active:scale-95',
    outline:
      'border-2 border-pink-300 text-pink-600 hover:bg-pink-50 active:scale-95',
    ghost:
      'text-pink-600 hover:bg-pink-50 active:scale-95',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outline' | 'ghost';
  active?: boolean;
  className?: string;
  label?: string;
}

export function IconButton({
  icon,
  onClick,
  variant = 'ghost',
  active = false,
  className = '',
  label,
}: IconButtonProps) {
  const baseStyles =
    'p-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center';

  const variantStyles = {
    filled: `${active ? 'bg-pink-300 text-neutral-900' : 'bg-neutral-200 text-neutral-700 hover:bg-pink-100'}`,
    outline: `${active ? 'border-2 border-pink-400 text-pink-600' : 'border-2 border-neutral-300 text-neutral-700 hover:border-pink-300'}`,
    ghost: `${active ? 'text-pink-600' : 'text-neutral-700 hover:text-pink-500'}`,
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}

export function WishlistButton({ isActive = false, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <IconButton
      icon={<Heart size={20} fill={isActive ? 'currentColor' : 'none'} />}
      onClick={onClick}
      variant="ghost"
      active={isActive}
      label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
      className="hover:scale-110"
    />
  );
}

export function CartButton({ onClick, count = 0 }: { onClick?: () => void; count?: number }) {
  return (
    <div className="relative">
      <IconButton
        icon={<ShoppingBag size={20} />}
        onClick={onClick}
        variant="ghost"
        label="View cart"
      />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}
