'use server';

import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import { revalidatePath } from 'next/cache';

export async function getBanners() {
  try {
    await connectToDatabase();
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(banners)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to load banners' };
  }
}

export async function getBannerById(id: string) {
  try {
    await connectToDatabase();
    const banner = await Banner.findById(id).lean();
    if (!banner) return { success: false, error: 'Banner not found' };
    return { success: true, data: JSON.parse(JSON.stringify(banner)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to load banner' };
  }
}

const readString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export async function createBanner(formData: FormData) {
  try {
    await connectToDatabase();
    
    const newBanner = await Banner.create({
      title: readString(formData, 'title'),
      subtitle: readString(formData, 'subtitle') || undefined,
      image: readString(formData, 'image'),
      mobileImage: readString(formData, 'mobileImage') || undefined,
      link: readString(formData, 'link') || undefined,
      location: readString(formData, 'location') as 'hero' | 'announcement' | 'sidebar' | 'footer' | 'category' | 'promo',
      ctaText: readString(formData, 'ctaText') || undefined,
      ctaLink: readString(formData, 'ctaLink') || undefined,
      isActive: readString(formData, 'isActive') === 'true',
      order: Number(formData.get('order')) || 0,
    });
    
    revalidatePath('/admin/banners');
    revalidatePath('/');
    return { success: true, data: JSON.parse(JSON.stringify(newBanner)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create banner' };
  }
}

export async function deleteBanner(id: string) {
  try {
    await connectToDatabase();
    await Banner.findByIdAndDelete(id);
    revalidatePath('/admin/banners');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete banner' };
  }
}

export async function updateBanner(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    const updated = await Banner.findByIdAndUpdate(
      id,
      {
        title: readString(formData, 'title'),
        subtitle: readString(formData, 'subtitle') || undefined,
        image: readString(formData, 'image'),
        mobileImage: readString(formData, 'mobileImage') || undefined,
        link: readString(formData, 'link') || undefined,
        location: readString(formData, 'location') as 'hero' | 'announcement' | 'sidebar' | 'footer' | 'category' | 'promo',
        ctaText: readString(formData, 'ctaText') || undefined,
        ctaLink: readString(formData, 'ctaLink') || undefined,
        isActive: readString(formData, 'isActive') === 'true',
        order: Number(formData.get('order')) || 0,
      },
      { new: true }
    ).lean();

    revalidatePath('/admin/banners');
    revalidatePath('/');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update banner' };
  }
}
