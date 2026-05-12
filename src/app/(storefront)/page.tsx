import React from 'react';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { FeaturedProducts } from '@/components/storefront/FeaturedProducts';

export default function StorefrontHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <FeaturedProducts />
      
      {/* Category Showcase Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Cards */}
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1515347619362-793574d6e90d?q=80&w=1000&auto=format&fit=crop" alt="Dresses" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                  <h3 className="font-heading font-bold text-xl">Dresses</h3>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop" alt="Tops" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                  <h3 className="font-heading font-bold text-xl">Tops</h3>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop" alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                  <h3 className="font-heading font-bold text-xl">Accessories</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story / Promo Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-heading text-4xl font-bold mb-6">Designed for the Modern Woman</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            At Luxe, we believe in fashion that empowers. Every piece in our collection is thoughtfully curated to blend timeless elegance with contemporary comfort. We source the finest materials to ensure you look and feel your absolute best.
          </p>
          <img src="/signature.png" alt="Signature" className="mx-auto h-12 opacity-50 hidden" /> {/* Placeholder for a signature */}
        </div>
      </section>
    </div>
  );
}
