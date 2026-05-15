import React from 'react';
import { getProducts } from '@/actions/product';
import { getCategories } from '@/actions/category';
import { ProductCard } from '@/components/premium';

type ProductRecord = {
  _id: string;
  title: string;
  slug: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  price: number;
  salePrice?: number;
  ratings?: number;
  reviewsCount?: number;
  stock?: number;
};

type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const productList = products as ProductRecord[];
  const categoryList = categories as CategoryRecord[];
  const activeProducts = productList.filter((product) => product.isActive);

  return (
    <div className="bg-[#fffaf7]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">The Boutique Edit</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl mb-4">
          The Collection
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Explore live inventory from your admin catalog, styled as a soft luxury shopping experience.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 border-y border-rose-100 bg-white/70 px-4 py-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select className="h-11 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200">
            <option>All Categories</option>
            {categoryList.map((category) => (
              <option key={category._id} value={category.slug}>{category.name}</option>
            ))}
          </select>
          <select className="h-11 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
        <div className="text-sm font-medium text-neutral-500">
          Showing {activeProducts.length} products
        </div>
      </div>

      {activeProducts.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-24 text-center text-neutral-600 shadow-sm">
          <p className="text-xl font-semibold text-neutral-900 mb-4">Our collection is currently updating.</p>
          <p>Please check back soon for our latest arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {activeProducts.map((product) => (
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
              isNew
              isTrending={product.isFeatured}
              stock={product.stock}
            />
          ))}
        </div>
      )}
      </section>
    </div>
  );
}
