import { NextRequest, NextResponse } from 'next/server';
import { deleteImage, extractFilePathFromUrl } from '@/lib/storage';

/**
 * POST /api/delete-image
 * Delete an image from Supabase Storage
 * 
 * Request body:
 * - { filePath: string }  (can be full URL or just the path)
 * 
 * Returns:
 * - { success: true }
 * - { success: false, error: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: 'filePath is required' },
        { status: 400 }
      );
    }

    // Extract path from URL if needed
    const pathToDelete = filePath.includes('supabase.co') 
      ? extractFilePathFromUrl(filePath)
      : filePath;

    const result = await deleteImage(pathToDelete);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[POST /api/delete-image]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
