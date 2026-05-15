'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PremiumHeader,
  PremiumFooter,
  ProductCard,
  EmptyState,
  LoadingGrid,
} from '@/components/premium';
import { getProducts } from '@/actions/product';
import { Filter, Grid3x3, List, X } from 'lucide-react';

interface FilterOptions {
  priceRange: [number, number];
  category: string;
  color: string;
  size: string;
  rating: number;
  sort: string;
}

export default function PremiumShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 500],
    category: searchParams?.get('category') || '',
    color: '',
    size: '',
    rating: 0,
    sort: searchParams?.get('sort') || 'featured',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result.ok && result.products) {
          setProducts(result.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply filters
    filtered = filtered.filter((product) => {
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesRating = !filters.rating || (product.rating || 0) >= filters.rating;
      return matchesPrice && matchesCategory && matchesRating;
    });

    // Apply sorting
    switch (filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'trending':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <PremiumHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 md:py-16 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-neutral-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
              The Collection
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore our thoughtfully curated collection of elegant, feminine pieces designed to make you feel beautiful inside and out.
            </p>
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-white rounded-2xl p-6 luxury-shadow sticky top-24">
                <div className="flex justify-between items-center mb-6 lg:mb-0">
                  <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden p-1 text-neutral-500 hover:text-neutral-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6 mt-6">
                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [Number(e.target.value), filters.priceRange[1]],
                          })
                        }
                        className="w-20 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                        placeholder="Min"
                      />
                      <span className="text-neutral-500">-</span>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [filters.priceRange[0], Number(e.target.value)],
                          })
                        }
                        className="w-20 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">Sort By</label>
                    <select
                      value={filters.sort}
                      onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="trending">Trending</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-3">Minimum Rating</label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1, 0].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => setFilters({ ...filters, rating })}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-700">
                            {rating === 0 ? 'All' : `★${rating} & up`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 500],
                        category: '',
                        color: '',
                        size: '',
                        rating: 0,
                        sort: 'featured',
                      })
                    }
                    className="w-full py-2 px-4 border-2 border-pink-300 text-pink-600 rounded-lg font-medium hover:bg-pink-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.aside>

            {/* Products Section */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-neutral-200"
              >
                <div className="text-sm text-neutral-600">
                  Showing <span className="font-semibold text-neutral-900">{filteredAndSortedProducts.length}</span> products
                </div>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-pink-100 text-pink-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                    title="Grid view"
                  >
                    <Grid3x3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-pink-100 text-pink-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                    title="List view"
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700 rounded-lg"
                    title="Toggle filters"
                  >
                    <Filter size={20} />
                  </button>
                </div>
              </motion.div>

              {/* Products Grid */}
              {loading ? (
                <LoadingGrid count={12} />
              ) : filteredAndSortedProducts.length === 0 ? (
                <EmptyState
                  type="no-results"
                  onAction={() =>
                    setFilters({
                      priceRange: [0, 500],
                      category: '',
                      color: '',
                      size: '',
                      rating: 0,
                      sort: 'featured',
                    })
                  }
                  actionLabel="Clear Filters"
                />
              ) : (
                <motion.div
                  layout
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      image={product.images?.[0] || '/images/product-placeholder.png'}
                      hoverImage={product.images?.[1]}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      rating={product.rating || 0}
                      reviewCount={product.reviewCount || 0}
                      isNew={product.isNew}
                      isTrending={product.isTrending}
                      discount={product.discount}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
