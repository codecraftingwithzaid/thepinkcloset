import React from 'react';
import { getProducts } from '@/actions/product';
import { ProductClient } from '@/components/admin/ProductClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts();

  return <ProductClient products={products || []} />;
}
