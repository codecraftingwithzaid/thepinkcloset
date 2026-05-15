# Supabase Storage Integration Guide

## Overview

This fashion eCommerce platform now uses **Supabase Storage** for managing all image uploads, replacing local storage with a cloud-based, scalable solution. This guide explains the architecture, usage, and best practices.

## Architecture

### Components

1. **Supabase Client** (`src/lib/supabase.ts`)
   - Browser client (uses anon key)
   - Admin client (uses service role key)

2. **Storage Utilities** (`src/lib/storage.ts`)
   - File validation
   - Upload/delete operations
   - URL management

3. **API Routes**
   - `/api/upload` - Handle single/multiple file uploads
   - `/api/delete-image` - Delete images from storage

4. **Upload Component** (`src/components/admin/ImageUpload.tsx`)
   - Drag-and-drop support
   - Progress tracking
   - Multiple uploads
   - File preview

### Database Schema

Models updated to store Supabase paths:
- `Product` → `imagePaths[]`
- `Banner` → `imagePath`, `mobileImagePath`
- `Collection` → `imagePath`, `featuredImagePath`, `bannerImagePath`
- `User` → `imagePath`

## Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Bucket Structure

Single bucket: `uploads`

Folder organization:
```
uploads/
├── products/       # Product images
├── collections/    # Collection images
├── banners/        # Banner images
├── categories/     # Category images
├── profiles/       # User profile images
└── blogs/          # Blog post images
```

## API Endpoints

### Upload Images

**POST** `/api/upload`

Request:
```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);
formData.append('folder', 'products');
formData.append('entityId', '123'); // optional

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

Response:
```json
{
  "success": true,
  "urls": [
    "https://xoopfdf...supabase.co/storage/v1/object/public/uploads/products/123/..."
  ]
}
```

### Delete Image

**POST** `/api/delete-image`

Request:
```javascript
const response = await fetch('/api/delete-image', {
  method: 'POST',
  body: JSON.stringify({
    filePath: 'products/123/filename.jpg'
  })
});
```

## Usage Examples

### In Admin Components

```typescript
import { ImageUpload } from '@/components/admin/ImageUpload';

export function MyAdminPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  const handleImageUpload = (urls: string[], paths: string[]) => {
    setImageUrls(urls);
    setImagePaths(paths);
  };

  return (
    <ImageUpload
      onUpload={handleImageUpload}
      folder="products"
      multiple={true}
      maxFiles={10}
      maxSize={5} // MB
    />
  );
}
```

### In Server Actions

```typescript
import { uploadImage, deleteImage } from '@/lib/storage';

export async function createProduct(formData: FormData) {
  // Get image URLs and paths from FormData
  const imageUrls = (formData.get('imageUrls') as string)?.split(',') || [];
  const imagePaths = (formData.get('imagePaths') as string)?.split(',') || [];

  // Save to database
  await Product.create({
    images: imageUrls,
    imagePaths: imagePaths,
  });
}

export async function deleteProduct(id: string) {
  const product = await Product.findById(id);
  
  // Delete all images
  for (const imagePath of product.imagePaths) {
    await deleteImage(imagePath);
  }
  
  await Product.findByIdAndDelete(id);
}
```

## File Validation

Allowed file types:
- jpg / jpeg
- png
- webp
- gif

Limits:
- Max file size: 5MB (configurable)
- Max files per upload: 10 (configurable)

## Image Optimization

Supabase Storage automatically provides:
- CDN delivery via edge locations
- Lossless compression
- WebP format support

For additional optimization, use Supabase image transformation URLs:

```typescript
// Resize and optimize
const optimizedUrl = `${imageUrl}?width=400&height=400&quality=75&format=webp`;
```

## Cleaning Up

When deleting products/banners/collections:

1. Retrieve image paths from database
2. Call `deleteImage()` for each path
3. Delete database record

```typescript
export async function deleteProduct(id: string) {
  const product = await Product.findById(id);
  
  // Clean up images before deleting product
  if (product?.imagePaths?.length > 0) {
    for (const path of product.imagePaths) {
      await deleteImage(path);
    }
  }
  
  await Product.findByIdAndDelete(id);
}
```

## Error Handling

All upload/delete operations include comprehensive error handling:

```typescript
const result = await uploadImage(file, 'products', 'product-123');

if (!result.success) {
  console.error('Upload failed:', result.error);
  // Handle error appropriately
} else {
  console.log('Uploaded to:', result.url);
}
```

## Security

✅ **Implemented:**
- File type validation (MIME type + extension)
- File size validation
- Secure API endpoints (server-side)
- No hardcoded secrets
- Service role key for admin operations

✅ **Best Practices:**
- Validate files server-side before storage
- Use Supabase RLS policies
- Keep API keys in environment variables
- Use signed URLs for sensitive images

## Performance Considerations

1. **Upload Progress**: Tracked and displayed to users
2. **Chunked Uploads**: Large files handled automatically
3. **CDN Delivery**: All images served via Supabase CDN
4. **Lazy Loading**: Implement on frontend
5. **Responsive Images**: Use transformation URLs

## Troubleshooting

### Upload fails

- Check file size < 5MB
- Verify file type (jpg, png, webp, gif)
- Check SUPABASE credentials in .env

### Images not displaying

- Verify image paths in database
- Check Supabase bucket policies
- Ensure storage bucket exists and is public

### Deletion fails

- Image may already be deleted
- Check file path format
- Verify service role key permissions

## Frontend Integration

### Display Images

```typescript
// From product
<img 
  src={product.images[0]} 
  alt="Product"
  loading="lazy"
/>
```

### With Fallback

```typescript
<img 
  src={product.images?.[0] || 'https://via.placeholder.com/600x800'}
  alt="Product"
  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/600x800'}
/>
```

### Responsive Images

```typescript
<picture>
  <source 
    srcSet={`${imageUrl}?width=400&format=webp`}
    media="(max-width: 640px)"
  />
  <source 
    srcSet={`${imageUrl}?width=800&format=webp`}
    media="(min-width: 641px)"
  />
  <img src={imageUrl} alt="Product" />
</picture>
```

## Migration Guide

### For Existing Images

If migrating from local storage:

1. Export all existing images
2. Upload to Supabase Storage (batch operation)
3. Update database records with new URLs and paths
4. Verify all images display correctly
5. Delete old local files

## Maintenance

- **Monitor Storage Usage**: Check Supabase dashboard
- **Clean Old Images**: Periodically delete orphaned files
- **Update Policies**: Review and update security policies
- **Backup Strategy**: Implement regular backups

## Cost Estimation

Supabase Storage pricing:
- 100 GB free storage
- Pay-as-you-go for additional storage
- No bandwidth charges for delivery

For a typical eCommerce store:
- ~1000 products × 3 images = ~300MB
- Competitive pricing for storage and CDN

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Image Transformations](https://supabase.com/docs/guides/storage/image-transformations)

---

**Integration Status**: ✅ Production Ready
**Last Updated**: May 15, 2026
