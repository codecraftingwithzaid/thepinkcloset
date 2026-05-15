'use server';

import connectToDatabase from '@/lib/db';
import Collection from '@/models/Collection';
import { revalidatePath } from 'next/cache';
import { deleteImage, extractFilePathFromUrl } from '@/lib/storage';

export async function getCollections() {
  try {
    await connectToDatabase();
    const collections = await Collection.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(collections)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const readString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export async function getCollectionById(id: string) {
  try {
    await connectToDatabase();
    const collection = await Collection.findById(id).populate('products', 'title price images isActive').lean();
    if (!collection) return { success: false, error: 'Collection not found' };
    return { success: true, data: JSON.parse(JSON.stringify(collection)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCollection(formData: FormData) {
  try {
    await connectToDatabase();
    
    const title = readString(formData, 'title');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const newCollection = await Collection.create({
      title,
      slug,
      description: readString(formData, 'description') || undefined,
      image: readString(formData, 'image') || undefined,
      imagePath: readString(formData, 'imagePath') || undefined,
      featuredImage: readString(formData, 'featuredImage') || undefined,
      featuredImagePath: readString(formData, 'featuredImagePath') || undefined,
      bannerImage: readString(formData, 'bannerImage') || undefined,
      bannerImagePath: readString(formData, 'bannerImagePath') || undefined,
      seoTitle: readString(formData, 'seoTitle') || undefined,
      seoDescription: readString(formData, 'seoDescription') || undefined,
      isActive: readString(formData, 'isActive') === 'true',
      featured: readString(formData, 'featured') === 'true',
      sortOrder: Number(readString(formData, 'sortOrder')) || 0,
    });
    
    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    return { success: true, data: JSON.parse(JSON.stringify(newCollection)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCollection(id: string) {
  try {
    await connectToDatabase();
    
    // Get collection to retrieve image paths
    const collection = await Collection.findById(id).lean();
    
    // Delete associated images
    if (collection?.imagePath) {
      await deleteImage(collection.imagePath);
    }
    if (collection?.featuredImagePath) {
      await deleteImage(collection.featuredImagePath);
    }
    if (collection?.bannerImagePath) {
      await deleteImage(collection.bannerImagePath);
    }
    
    await Collection.findByIdAndDelete(id);
    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCollection(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    // Get current collection for old image paths
    const currentCollection = await Collection.findById(id).lean();

    const title = readString(formData, 'title');
    
    const image = readString(formData, 'image') || undefined;
    const imagePath = readString(formData, 'imagePath') || undefined;
    const featuredImage = readString(formData, 'featuredImage') || undefined;
    const featuredImagePath = readString(formData, 'featuredImagePath') || undefined;
    const bannerImage = readString(formData, 'bannerImage') || undefined;
    const bannerImagePath = readString(formData, 'bannerImagePath') || undefined;

    // Delete old images if they changed
    if (imagePath && currentCollection?.imagePath && imagePath !== currentCollection.imagePath) {
      await deleteImage(currentCollection.imagePath);
    }
    if (featuredImagePath && currentCollection?.featuredImagePath && featuredImagePath !== currentCollection.featuredImagePath) {
      await deleteImage(currentCollection.featuredImagePath);
    }
    if (bannerImagePath && currentCollection?.bannerImagePath && bannerImagePath !== currentCollection.bannerImagePath) {
      await deleteImage(currentCollection.bannerImagePath);
    }

    const updated = await Collection.findByIdAndUpdate(
      id,
      {
        title,
        slug: readString(formData, 'slug') || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: readString(formData, 'description') || undefined,
        image,
        imagePath,
        featuredImage,
        featuredImagePath,
        bannerImage,
        bannerImagePath,
        seoTitle: readString(formData, 'seoTitle') || undefined,
        seoDescription: readString(formData, 'seoDescription') || undefined,
        isActive: readString(formData, 'isActive') === 'true',
        featured: readString(formData, 'featured') === 'true',
        sortOrder: Number(readString(formData, 'sortOrder')) || 0,
      },
      { new: true }
    ).lean();

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
