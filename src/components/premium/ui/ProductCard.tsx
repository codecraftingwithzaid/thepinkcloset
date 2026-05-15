'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  id: string;
  name: string;
  slug?: string;
  image: string;
  hoverImage?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isTrending?: boolean;
  isLimited?: boolean;
  discount?: number;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
  badge?: string;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  image,
  hoverImage,
  price,
  originalPrice,
  rating,
  reviewCount,
  isNew,
  isTrending,
  isLimited,
  discount,
  onQuickView,
  onAddToCart,
  onWishlist,
  isWishlisted,
  badge,
  stock,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isStoredWishlisted = wishlistItems.some((item) => item.id === id);

  const displayImage = !imageError && isHovered && hoverImage ? hoverImage : !imageError ? image : '';
  const discountPercentage = discount || (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const href = slug ? `/product/${slug}` : `/shop?product=${id}`;
  const wishlisted = isWishlisted ?? isStoredWishlisted;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({
      id,
      title: name,
      price,
      image,
      quantity: 1,
    });
    onAddToCart?.();
  };

  const handleWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        title: name,
        price,
        image,
        slug: slug || id,
      });
    }
    onWishlist?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4] mb-4 luxury-shadow">
        {/* Image */}
        <Link href={href} className="block h-full w-full">
          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-50 p-8 text-center">
              <span className="font-display text-2xl font-bold text-rose-700">{name}</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <span className="bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </span>
          )}
          {isTrending && (
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Zap size={12} /> TRENDING
            </span>
          )}
          {isLimited && (
            <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              LIMITED
            </span>
          )}
          {badge && (
            <span className="bg-amber-400 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
            -{discountPercentage}%
          </div>
        )}

        {/* Overlay Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-4 gap-3"
        >
          <button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onQuickView?.();
            }}
            className="bg-white/90 hover:bg-white text-neutral-900 rounded-lg px-4 py-2 flex items-center gap-2 font-medium transition-all hover:shadow-lg"
          >
            <Eye size={18} /> Quick View
          </button>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 rounded-lg px-4 py-2 flex items-center gap-2 font-medium transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={18} /> {stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </motion.div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute bottom-4 right-4 rounded-full p-2 backdrop-blur-sm transition-all ${
            wishlisted
              ? 'bg-pink-300 text-neutral-900'
              : 'bg-white/80 text-neutral-700 hover:bg-pink-100'
          }`}
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Info */}
      <Link href={href} className="block space-y-2">
        <h3 className="text-neutral-900 font-semibold line-clamp-2 text-sm hover:text-pink-600 transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < Math.floor(rating) ? 'text-amber-400' : 'text-neutral-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-neutral-500">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-900 font-bold text-lg">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-neutral-500 line-through text-sm">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-neutral-200 rounded-2xl aspect-square animate-pulse" />
      <div className="space-y-2">
        <div className="bg-neutral-200 h-4 rounded w-3/4 animate-pulse" />
        <div className="bg-neutral-200 h-3 rounded w-1/2 animate-pulse" />
        <div className="bg-neutral-200 h-5 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  );
}
