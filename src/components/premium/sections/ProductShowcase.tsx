'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard, EmptyState } from '../index';

interface FeaturedProductsSectionProps {
  products?: any[];
}

export function FeaturedProductsSection({ products = [] }: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { value: 'new', label: 'New Arrivals' },
    { value: 'trending', label: 'Trending' },
    { value: 'bestsellers', label: 'Best Sellers' },
  ];

  const filteredProducts = products
    .filter((product) => {
      if (activeTab === 'trending') return product.tags?.includes('trending') || product.isFeatured;
      if (activeTab === 'bestsellers') return product.reviewsCount > 0 || product.ratings > 0 || product.isFeatured;
      return true;
    })
    .slice(0, 12);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 12);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Discover Our Latest Collections
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Handpicked pieces pulled directly from your live product catalog.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-wrap justify-center gap-2 bg-neutral-100 rounded-full p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-5 py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
                    activeTab === tab.value
                      ? 'bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 shadow-md'
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState type="no-products" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.title}
                  slug={product.slug}
                  image={product.images?.[0] || ''}
                  hoverImage={product.images?.[1]}
                  price={product.salePrice || product.price}
                  originalPrice={product.salePrice ? product.price : undefined}
                  rating={product.ratings || 0}
                  reviewCount={product.reviewsCount || 0}
                  isNew={activeTab === 'new'}
                  isTrending={product.tags?.includes('trending') || product.isFeatured}
                  stock={product.stock}
                />
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            View All Products
            <span className="text-xl">-&gt;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

interface TextBannerProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundColor?: string;
}

export function TextBannerSection({
  title,
  description,
  ctaLabel,
  ctaHref,
  backgroundColor = 'from-rose-100 to-pink-100',
}: TextBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`py-16 md:py-20 bg-gradient-to-r ${backgroundColor}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          {title}
        </h2>
        <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-neutral-50 text-neutral-900 rounded-lg font-semibold transition-all"
          >
            {ctaLabel}
            <span>-&gt;</span>
          </a>
        )}
      </div>
    </motion.section>
  );
}
