import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, uploadImages, deleteImage, STORAGE_FOLDERS } from '@/lib/storage';

export const maxDuration = 60; // 60 seconds max runtime

/**
 * POST /api/upload
 * Handle single or multiple file uploads
 * 
 * Request body:
 * - formData with "files" (single or multiple) and "folder"
 * 
 * Returns:
 * - { success: true, urls: [...], errors?: [...] }
 * - { success: false, error: string }
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const folder = (formData.get('folder') as string) || 'products';
    const entityId = formData.get('entityId') as string | undefined;

    // Validate folder
    const validFolders = Object.values(STORAGE_FOLDERS);
    if (!validFolders.includes(folder as any)) {
      return NextResponse.json(
        { success: false, error: 'Invalid folder specified' },
        { status: 400 }
      );
    }

    // Check for files
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Handle single or multiple uploads
    if (files.length === 1) {
      const result = await uploadImage(files[0], folder as any, entityId);
      if (result.success) {
        return NextResponse.json(
          { success: true, urls: [result.url] },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else {
      const result = await uploadImages(files, folder as any, entityId);
      if (result.success) {
        return NextResponse.json(
          { success: true, urls: result.urls },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: result.errors?.join(', ') || 'Upload failed' },
          { status: 400 }
        );
      }
    }
  } catch (error: any) {
    console.error('[POST /api/upload]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
