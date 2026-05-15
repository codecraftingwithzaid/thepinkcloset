'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/product';
import { getCategories } from '@/actions/category';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCats() {
      const cats = await getCategories();
      setCategories(cats || []);
    }
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Add image URLs and paths to FormData
    if (imageUrls.length > 0) {
      formData.set('imageUrls', imageUrls.join(','));
      formData.set('imagePaths', imagePaths.join(','));
    }

    try {
      await createProduct(formData);
    } catch (error) {
      toast.error('Failed to create product', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setIsLoading(false);
    }
  };

  const handleImageUpload = (urls: string[], paths: string[]) => {
    setImageUrls(urls);
    setImagePaths(paths);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground mt-1">Create a beautiful new product listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input id="title" name="title" required placeholder="e.g. The Silk Midnight Slip Dress" className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" name="shortDescription" required placeholder="A brief summary for product cards..." className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <textarea
                  id="description"
                  name="description"
                  required
                  className="w-full min-h-[150px] rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Tell the full story of this product. Detail the fabric, the fit, and why it's special..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input id="sku" name="sku" required placeholder="DRS-001" className="bg-muted/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock">Available Stock</Label>
                  <Input id="stock" name="stock" type="number" required placeholder="0" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full h-9 rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>Upload high-quality images.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onUpload={handleImageUpload}
                folder="products"
                multiple={true}
                maxFiles={10}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full font-semibold">Draft</span>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || imageUrls.length === 0}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  'Publish Product'
                )}
              </Button>
              {imageUrls.length === 0 && (
                <p className="text-xs text-muted-foreground">* Please upload at least one image</p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
