import { supabaseAdmin } from '@/lib/supabase';

/**
 * Image upload configuration and validation
 */
export const UPLOAD_CONFIG = {
  BUCKET_NAME: 'uploads',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
};

/**
 * Folder paths for different entity types
 */
export const STORAGE_FOLDERS = {
  PRODUCTS: 'products',
  COLLECTIONS: 'collections',
  BANNERS: 'banners',
  CATEGORIES: 'categories',
  PROFILES: 'profiles',
  BLOGS: 'blogs',
} as const;

export type StorageFolder = (typeof STORAGE_FOLDERS)[keyof typeof STORAGE_FOLDERS];

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check MIME type
  if (!UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File extension must be one of: ${UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Generate unique file path for storage
 */
export function generateFilePath(folder: StorageFolder, fileName: string, entityId?: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanFileName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');

  if (entityId) {
    return `${folder}/${entityId}/${timestamp}-${randomStr}-${cleanFileName}`;
  }

  return `${folder}/${timestamp}-${randomStr}-${cleanFileName}`;
}

/**
 * Get public URL for an image
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabaseAdmin.storage
    .from(UPLOAD_CONFIG.BUCKET_NAME)
    .getPublicUrl(filePath);

  return data?.publicUrl || '';
}

/**
 * Upload a single image file to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: StorageFolder,
  entityId?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate file path
    const filePath = generateFilePath(folder, file.name, entityId);

    // Upload file
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[uploadImage] Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const url = getPublicUrl(data.path);

    return { success: true, url };
  } catch (error: any) {
    console.error('[uploadImage] Error:', error);
    return { success: false, error: error.message || 'Failed to upload image' };
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  folder: StorageFolder,
  entityId?: string
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder, entityId));
    const results = await Promise.all(uploadPromises);

    const urls: string[] = [];
    const errors: string[] = [];

    results.forEach((result) => {
      if (result.success && result.url) {
        urls.push(result.url);
      } else if (result.error) {
        errors.push(result.error);
      }
    });

    return {
      success: errors.length === 0,
      urls,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('[uploadImages] Error:', error);
    return { success: false, errors: [error.message || 'Failed to upload images'] };
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!filePath) {
      return { success: true }; // Silently succeed for empty paths
    }

    // Extract path from full URL if needed
    const pathToDelete = filePath.includes('/')
      ? filePath
      : filePath;

    const { error } = await supabaseAdmin.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .remove([pathToDelete]);

    if (error) {
      console.error('[deleteImage] Delete error:', error);
      // Don't fail if file doesn't exist
      if (error.message.includes('not found')) {
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[deleteImage] Error:', error);
    // Silently handle errors for robustness
    return { success: true };
  }
}

/**
 * Delete multiple images
 */
export async function deleteImages(filePaths: string[]): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const deletePromises = filePaths
      .filter((path) => path) // Filter out empty paths
      .map((path) => deleteImage(path));

    const results = await Promise.all(deletePromises);

    const errors: string[] = [];
    results.forEach((result) => {
      if (!result.success && result.error) {
        errors.push(result.error);
      }
    });

    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('[deleteImages] Error:', error);
    return { success: true }; // Silently succeed for robustness
  }
}

/**
 * Replace an image (delete old, upload new)
 */
export async function replaceImage(
  oldFilePath: string | undefined,
  newFile: File,
  folder: StorageFolder,
  entityId?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Delete old image if it exists
    if (oldFilePath) {
      await deleteImage(oldFilePath);
    }

    // Upload new image
    return await uploadImage(newFile, folder, entityId);
  } catch (error: any) {
    console.error('[replaceImage] Error:', error);
    return { success: false, error: error.message || 'Failed to replace image' };
  }
}

/**
 * Extract file path from Supabase public URL
 * Converts: https://xoopf...supabase.co/storage/v1/object/public/uploads/products/123-abc-image.jpg
 * To: products/123-abc-image.jpg
 */
export function extractFilePathFromUrl(url: string): string {
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
    return match ? match[1] : url;
  } catch {
    return url;
  }
}
