'use server';

import connectToDatabase from '@/lib/db';
import Blog from '@/models/Blog';
import { revalidatePath } from 'next/cache';

export async function getBlogs() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(blogs)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to load blogs' };
  }
}

export async function getBlogById(id: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(id).lean();
    if (!blog) return { success: false, error: 'Blog not found' };
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to load blog' };
  }
}

const readString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export async function createBlog(formData: FormData) {
  try {
    await connectToDatabase();
    
    const title = readString(formData, 'title');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const newBlog = await Blog.create({
      title,
      slug,
      content: readString(formData, 'content'),
      excerpt: readString(formData, 'excerpt') || undefined,
      author: readString(formData, 'author') || 'Admin',
      status: (readString(formData, 'status') || 'draft') as 'draft' | 'published' | 'archived',
      category: readString(formData, 'category') || 'Uncategorized',
      coverImage: readString(formData, 'coverImage') || undefined,
      featuredImage: readString(formData, 'featuredImage') || undefined,
      metaTitle: readString(formData, 'metaTitle') || undefined,
      metaDescription: readString(formData, 'metaDescription') || undefined,
      tags: readString(formData, 'tags') ? readString(formData, 'tags').split(',').map((value) => value.trim()).filter(Boolean) : [],
      featured: readString(formData, 'featured') === 'true',
      readingTime: Number(readString(formData, 'readingTime')) || 0,
      publishedAt: readString(formData, 'publishedAt') ? new Date(readString(formData, 'publishedAt')) : undefined,
    });
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    return { success: true, data: JSON.parse(JSON.stringify(newBlog)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create blog' };
  }
}

export async function deleteBlog(id: string) {
  try {
    await connectToDatabase();
    await Blog.findByIdAndDelete(id);
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete blog' };
  }
}

export async function updateBlog(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    const title = readString(formData, 'title');
    const slug = readString(formData, 'slug') || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const updated = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content: readString(formData, 'content'),
        excerpt: readString(formData, 'excerpt') || undefined,
        author: readString(formData, 'author') || 'Admin',
        status: (readString(formData, 'status') || 'draft') as 'draft' | 'published' | 'archived',
        category: readString(formData, 'category') || 'Uncategorized',
        coverImage: readString(formData, 'coverImage') || undefined,
        featuredImage: readString(formData, 'featuredImage') || undefined,
        metaTitle: readString(formData, 'metaTitle') || undefined,
        metaDescription: readString(formData, 'metaDescription') || undefined,
        tags: readString(formData, 'tags') ? readString(formData, 'tags').split(',').map((value) => value.trim()).filter(Boolean) : [],
        featured: readString(formData, 'featured') === 'true',
        readingTime: Number(readString(formData, 'readingTime')) || 0,
        publishedAt: readString(formData, 'publishedAt') ? new Date(readString(formData, 'publishedAt')) : undefined,
      },
      { new: true }
    ).lean();

    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update blog' };
  }
}
