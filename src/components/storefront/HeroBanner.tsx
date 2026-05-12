'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroBanner() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-muted/30">
      {/* Background Image Placeholder - using a soft pastel color if image fails */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-1000"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")',
        }}
      />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />

      <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl space-y-6"
        >
          <h4 className="text-sm font-medium uppercase tracking-widest text-primary">
            New Collection 2026
          </h4>
          <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
            Elegance in Every Thread
          </h1>
          <p className="mx-auto max-w-lg text-lg text-foreground/80">
            Discover our latest arrivals featuring premium silk, soft pastels, and timeless silhouettes designed for the modern woman.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-8 text-md h-12 shadow-lg hover:scale-105 transition-transform duration-300">
                Shop the Collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
