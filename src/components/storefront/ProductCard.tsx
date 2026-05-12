'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.addItem); // Need a toggle function
  const wishlistItems = useWishlistStore((state) => state.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
    });
    // Normally you'd show a toast here
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    // Simplified logic
    if (!isInWishlist) {
      toggleWishlist({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0] || '',
        slug: product.slug,
      });
    }
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted/40 mb-4">
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/600x800?text=No+Image'} 
            alt={product.title} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <button 
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isInWishlist ? 'bg-primary/20 text-primary' : 'bg-background/60 text-muted-foreground hover:bg-background hover:text-foreground'}`}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-background/90 text-foreground hover:bg-background backdrop-blur-sm shadow-sm rounded-full"
            >
              Add to Cart
            </Button>
          </div>
        </div>
        <CardContent className="p-0 text-center">
          <h3 className="font-medium text-foreground/90 group-hover:text-primary transition-colors">{product.title}</h3>
          <p className="text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
