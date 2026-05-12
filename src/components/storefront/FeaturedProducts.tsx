'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data until we connect to the real DB for the storefront
const mockProducts = [
  {
    _id: '1',
    title: 'Blush Silk Slip Dress',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
    slug: 'blush-silk-slip-dress'
  },
  {
    _id: '2',
    title: 'Ivory Wrap Blouse',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1604085444648-52f1437cc436?q=80&w=1000&auto=format&fit=crop',
    slug: 'ivory-wrap-blouse'
  },
  {
    _id: '3',
    title: 'Pleated Midi Skirt',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1583496661160-c588c4c1e0b5?q=80&w=1000&auto=format&fit=crop',
    slug: 'pleated-midi-skirt'
  },
  {
    _id: '4',
    title: 'Cashmere Blend Cardigan',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1434389678369-184bf3426e2e?q=80&w=1000&auto=format&fit=crop',
    slug: 'cashmere-blend-cardigan'
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl font-bold mb-4"
          >
            Trending Now
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: '60px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 bg-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/product/${product.slug}`}>
                <Card className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted/40 mb-4">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Add Button overlay */}
                    <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button className="w-full bg-background/90 text-foreground hover:bg-background backdrop-blur-sm shadow-sm rounded-full">
                        Quick View
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-0 text-center">
                    <h3 className="font-medium text-foreground/90 group-hover:text-primary transition-colors">{product.title}</h3>
                    <p className="text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-colors">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
