'use server';

import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  await connectToDatabase();

  const categories = await Category.find({})
    .sort({ name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  try {
    await connectToDatabase();

    const category = await Category.create({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
    });

    revalidatePath('/admin/categories');

    return {
      success: true,
      category: JSON.parse(JSON.stringify(category)),
    };
  } catch (error) {
    console.error('Create Category Error:', error);

    return {
      success: false,
      message: 'Failed to create category',
    };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
  }
) {
  try {
    await connectToDatabase();

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true }
    );

    revalidatePath('/admin/categories');

    return {
      success: true,
      category: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    console.error('Update Category Error:', error);

    return {
      success: false,
      message: 'Failed to update category',
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToDatabase();

    await Category.findByIdAndDelete(id);

    revalidatePath('/admin/categories');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete Category Error:', error);

    return {
      success: false,
      message: 'Failed to delete category',
    };
  }
}

export async function seedCategories() {
  await connectToDatabase();

  const count = await Category.countDocuments();

  if (count === 0) {
    await Category.create([
      {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Elegant dresses for every occasion.',
      },
      {
        name: 'Tops',
        slug: 'tops',
        description: 'Beautiful blouses and shirts.',
      },
      {
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Skirts, pants, and shorts.',
      },
    ]);
  }
}