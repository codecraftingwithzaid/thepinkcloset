import React from 'react';
import { getCategories } from '@/actions/category';
import { CategoryClient } from '@/components/admin/CategoryClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryClient categories={categories || []} />;
}
