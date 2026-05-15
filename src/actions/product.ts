'use server';

import connectToDatabase from '@/lib/db';
// Import Category BEFORE Product to register its schema in Mongoose,
// preventing MissingSchemaError when Product.populate('category') runs.
import '@/models/Category';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteImage, extractFilePathFromUrl } from '@/lib/storage';

export async function getProducts() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 }).populate('category', 'name').lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    console.error('[getProducts]', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  await connectToDatabase();
  const product = await Product.findOne({ slug }).populate('category', 'name').lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

export async function getProductById(id: string) {
  try {
    await connectToDatabase();
    const product = await Product.findById(id).populate('category', 'name').lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    console.error('[getProductById]', error);
    return null;
  }
}

export async function createProduct(formData: FormData) {
  debugger;
  await connectToDatabase();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const price = Number(formData.get('price'));
  const sku = formData.get('sku') as string;
  const stock = Number(formData.get('stock'));
  const category = formData.get('category') as string;

  // Get image URLs and paths from FormData (uploaded via API)
  const imageUrls = (formData.get('imageUrls') as string)?.split(',').filter(Boolean) || [];
  const imagePaths = (formData.get('imagePaths') as string)?.split(',').filter(Boolean) || [];

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Use Supabase URLs or fallback to placeholder
  const images = imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/600x800?text=Luxury+Dress'];

  await Product.create({
    title,
    slug,
    description,
    shortDescription,
    price,
    sku,
    stock,
    category,
    images,
    imagePaths: imagePaths.length > 0 ? imagePaths : undefined,
    isActive: true,
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  debugger;
  try {
    await connectToDatabase();
    
    // Get product to retrieve image paths
    const product = await Product.findById(id).lean();
    
    // Delete all associated images from Supabase
    if (product?.imagePaths && product.imagePaths.length > 0) {
      for (const imagePath of product.imagePaths) {
        await deleteImage(imagePath);
      }
    }
    
    await Product.findByIdAndDelete(id);
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteProduct]', error);
    return { success: false, error: error.message };
  }
}

export async function updateProductStatus(id: string, isActive: boolean) {
  try {
    await connectToDatabase();
    await Product.findByIdAndUpdate(id, { isActive }, { new: true });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    console.error('[updateProductStatus]', error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await connectToDatabase();
    await Product.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    console.error('[updateProduct]', error);
    return { success: false, error: error.message };
  }
}

export async function updateProductFromFormData(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const price = Number(formData.get('price'));
    const sku = formData.get('sku') as string;
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string;

    // Get image URLs and paths from FormData
    const imageUrls = (formData.get('imageUrls') as string)?.split(',').filter(Boolean) || [];
    const imagePaths = (formData.get('imagePaths') as string)?.split(',').filter(Boolean) || [];
    
    // Get old image paths for deletion
    const oldImagePaths = (formData.get('oldImagePaths') as string)?.split(',').filter(Boolean) || [];

    // Delete old images that were removed
    for (const oldPath of oldImagePaths) {
      if (!imagePaths.includes(oldPath)) {
        await deleteImage(extractFilePathFromUrl(oldPath));
      }
    }

    const updateData: any = {
      title,
      description,
      shortDescription,
      price,
      sku,
      stock,
      category,
    };

    // Update images if new ones were uploaded
    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
      updateData.imagePaths = imagePaths.length > 0 ? imagePaths : undefined;
    }

    await Product.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    console.error('[updateProductFromFormData]', error);
    return { success: false, error: error.message };
  }
}
