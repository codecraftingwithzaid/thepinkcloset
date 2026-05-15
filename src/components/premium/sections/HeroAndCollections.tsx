'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LuxuryButton } from '../ui/LuxuryButton';

interface HeroSectionProps {
  banner?: {
    title?: string;
    subtitle?: string;
    image?: string;
    mobileImage?: string;
    ctaText?: string;
    ctaLink?: string;
    link?: string;
  };
  fallbackProduct?: {
    title?: string;
    images?: string[];
  };
}

export function HeroSection({ banner, fallbackProduct }: HeroSectionProps) {
  const heroImage = banner?.image || fallbackProduct?.images?.[0];
  const heroTitle = banner?.title || 'Elegance Redefined';
  const heroSubtitle =
    banner?.subtitle ||
    fallbackProduct?.title ||
    'Discover exquisite fashion pieces from our live collection, curated for softness, confidence, and modern romance.';
  const ctaHref = banner?.ctaLink || banner?.link || '/shop';
  const ctaText = banner?.ctaText || 'Explore Collection';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] md:min-h-[680px] flex items-center justify-center overflow-hidden bg-[#fff7f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 md:space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full w-fit">
              <Sparkles size={16} className="text-pink-600" />
              <span className="text-sm font-semibold text-pink-700">New Season Edit</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 leading-tight"
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-neutral-700 max-w-md"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <a href={ctaHref}>
                <LuxuryButton size="lg">
                  {ctaText} <ArrowRight size={20} />
                </LuxuryButton>
              </a>
              <a href="/shop?sort=trending">
                <LuxuryButton variant="outline" size="lg">
                  Shop Sale
                </LuxuryButton>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-200/50"
            >
              {[
                { label: 'Free Shipping', desc: 'On orders $100+' },
                { label: 'Easy Returns', desc: '30 days' },
                { label: 'Secure Checkout', desc: '100% Safe' },
              ].map((badge, idx) => (
                <div key={idx} className="text-sm">
                  <p className="font-semibold text-neutral-900">{badge.label}</p>
                  <p className="text-neutral-600">{badge.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden md:block h-[500px]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative w-full h-full rounded-2xl overflow-hidden luxury-shadow bg-gradient-to-br from-pink-100 via-white to-rose-100"
            >
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-12 text-center">
                  <div>
                    <p className="font-display text-5xl font-bold text-rose-700">PINK CLOSET</p>
                    <p className="mt-4 text-neutral-600">Add a hero banner in admin to feature your latest campaign here.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-600 font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [2, 6, 2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-neutral-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

interface FeaturedCollectionsProps {
  collections?: Array<{
    id: string;
    name: string;
    image?: string;
    productCount: number;
    href: string;
  }>;
}

export function FeaturedCollectionsSection({ collections = [] }: FeaturedCollectionsProps) {
  const defaultCollections: FeaturedCollectionsProps['collections'] = [
    { id: '1', name: 'New Arrivals', productCount: 0, href: '/shop?sort=new' },
    { id: '2', name: 'Elegant Dresses', productCount: 0, href: '/shop?category=dresses' },
    { id: '3', name: 'Soft Essentials', productCount: 0, href: '/shop?sort=featured' },
    { id: '4', name: 'Evening Edit', productCount: 0, href: '/shop?sort=trending' },
  ];

  const displayCollections = collections.length > 0 ? collections : defaultCollections;

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Explore Collections
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Curated collections for every occasion and style
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCollections.map((collection, idx) => (
            <motion.a
              key={collection.id}
              href={collection.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl overflow-hidden h-80 cursor-pointer"
            >
              {collection.image ? (
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-pink-100 via-rose-50 to-white" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                <p className="text-sm opacity-90">{collection.productCount} Products</p>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Shop Now <ArrowRight size={16} />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
