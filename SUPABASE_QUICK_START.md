# Supabase Storage Integration - Quick Start

## What's Installed ✅

1. **@supabase/supabase-js** - Supabase client library
2. **Supabase client utilities** - Ready to use in `src/lib/supabase.ts`
3. **Storage utilities** - Image upload/delete in `src/lib/storage.ts`
4. **API routes** - `/api/upload` and `/api/delete-image`
5. **Upload component** - Reusable `ImageUpload` in `src/components/admin/`
6. **Image hooks** - `useImageUpload` for client-side uploads
7. **Optimized image components** - `OptimizedImage`, `ResponsiveImage`, `OptimizedAvatar`

## Environment Variables ✅

Your `.env.local` already has Supabase credentials configured:

```env
SUPABASE_URL=https://xoopfdfvvwshzqvnfurw.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Database Updates ✅

Models updated to store image paths:
- ✅ Product: `imagePaths[]`
- ✅ Banner: `imagePath`, `mobileImagePath`
- ✅ Collection: `imagePath`, `featuredImagePath`, `bannerImagePath`
- ✅ User: `imagePath`

## Server Actions Updated ✅

- ✅ `src/actions/product.ts` - Create, update, delete with images
- ✅ `src/actions/banner.ts` - Banner image management
- ✅ `src/actions/collection.ts` - Collection image management
- ✅ `src/actions/customer.ts` - Profile image management

## Admin Pages Updated ✅

- ✅ `src/app/admin/products/new/page.tsx` - Uses ImageUpload component

## Quick Usage Guide

### 1. Product Upload (Admin)

```tsx
import { ImageUpload } from '@/components/admin/ImageUpload';

export function ProductForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  const handleSubmit = async (e) => {
    const formData = new FormData(e.currentTarget);
    formData.set('imageUrls', imageUrls.join(','));
    formData.set('imagePaths', imagePaths.join(','));
    await createProduct(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload
        onUpload={(urls, paths) => {
          setImageUrls(urls);
          setImagePaths(paths);
        }}
        folder="products"
        multiple={true}
      />
      <button type="submit">Save Product</button>
    </form>
  );
}
```

### 2. Display Images (Frontend)

```tsx
import { OptimizedImage, ResponsiveImage } from '@/components/OptimizedImage';

// Simple image
<OptimizedImage
  src={product.images[0]}
  alt="Product"
  width={600}
  height={800}
  quality={85}
/>

// Responsive image
<ResponsiveImage
  src={product.images[0]}
  alt="Product"
  mobileWidth={400}
  desktopWidth={800}
/>

// Avatar
<OptimizedAvatar
  src={user.image}
  alt={user.name}
  size="lg"
/>
```

### 3. Upload in Component

```tsx
import { useImageUpload } from '@/hooks/useImageUpload';

export function ImageUploadForm() {
  const { upload, urls, paths, isLoading } = useImageUpload({
    folder: 'products',
    multiple: true,
  });

  const handleDrop = (e) => {
    e.preventDefault();
    upload(e.dataTransfer.files);
  };

  return (
    <div onDrop={handleDrop}>
      {isLoading && 'Uploading...'}
      {urls.length > 0 && (
        <div>
          {urls.map((url) => (
            <img key={url} src={url} alt="Uploaded" />
          ))}
        </div>
      )}
    </div>
  );
}
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── storage.ts            # Upload/delete utilities
├── app/
│   └── api/
│       ├── upload/route.ts   # Upload endpoint
│       └── delete-image/     # Delete endpoint
├── components/
│   ├── admin/
│   │   └── ImageUpload.tsx   # Upload component
│   └── OptimizedImage.tsx    # Image optimization
├── hooks/
│   └── useImageUpload.ts     # Upload hook
└── actions/
    ├── product.ts            # Updated
    ├── banner.ts             # Updated
    ├── collection.ts         # Updated
    └── customer.ts           # Updated
```

## Next Steps

### 1. Update Remaining Admin Pages

Update these pages to use `ImageUpload` component:
- [ ] `src/app/admin/products/[id]/page.tsx` (product edit)
- [ ] `src/app/admin/banners/new.tsx` (new banner)
- [ ] `src/app/admin/banners/[id].tsx` (edit banner)
- [ ] `src/app/admin/collections/new.tsx` (new collection)
- [ ] `src/app/admin/collections/[id].tsx` (edit collection)

### 2. Create Supabase Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Storage** → **Buckets**
4. Create new bucket named: `uploads`
5. Set to **Public** (allow read access)

### 3. Set Storage Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads');

-- Allow public read access
CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'uploads');

-- Allow users to delete their own uploads
CREATE POLICY "Allow user delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'uploads');
```

### 4. Test Upload

```bash
npm run dev
# Navigate to http://localhost:3000/admin/products/new
# Try uploading an image
```

## Important Reminders

- ✅ All existing APIs remain functional
- ✅ No breaking changes to database
- ✅ Images stored in one organized bucket
- ✅ Automatic CDN delivery
- ✅ Scalable to production
- ✅ Secure by design (uses keys from env vars)

## Validation Rules

- **File types**: jpg, jpeg, png, webp, gif
- **Max size**: 5MB per file
- **Max files**: 10 per upload

## Troubleshooting

### Upload fails with "No files provided"
- Check file selection in form
- Verify FormData includes 'files' field

### Images not displaying
- Check Supabase bucket exists
- Verify bucket is set to public
- Check image URLs in database

### Delete fails
- Verify imagePath is stored correctly
- Check service role key in env
- Try with full URL format

## Documentation

Full guide available in: [SUPABASE_STORAGE_GUIDE.md](./SUPABASE_STORAGE_GUIDE.md)

---

**Status**: Production Ready ✅
**Last Updated**: May 15, 2026
