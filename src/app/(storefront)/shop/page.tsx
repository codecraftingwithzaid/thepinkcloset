import React from 'react';
import { getProducts } from '@/actions/product';
import { ProductCard } from '@/components/storefront/ProductCard';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          The Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our thoughtfully curated collection of elegant, feminine pieces designed to make you feel beautiful inside and out.
        </p>
      </div>

      {/* Advanced Filtering Area Placeholder */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b">
        <div className="flex gap-4 mb-4 md:mb-0">
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option>All Categories</option>
            <option>Dresses</option>
            <option>Tops</option>
            <option>Bottoms</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {products.length} products
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-xl mb-4">Our collection is currently updating.</p>
          <p>Please check back soon for our latest arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
