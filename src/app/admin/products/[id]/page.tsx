'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateProductFromFormData, getProductById } from '@/actions/product';
import { getCategories } from '@/actions/category';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [fetchedProduct, cats] = await Promise.all([
                    getProductById(productId),
                    getCategories(),
                ]);

                if (!fetchedProduct) {
                    toast.error('Product not found');
                    router.push('/admin/products');
                    return;
                }

                setProduct(fetchedProduct);
                setCategories(cats || []);
            } catch (error) {
                toast.error('Failed to load product');
                router.push('/admin/products');
            } finally {
                setIsLoadingData(false);
            }
        }

        fetchData();
    }, [productId, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const res = await updateProductFromFormData(productId, formData);

        if (res?.success) {
            toast.success('Product updated successfully');
            router.push('/admin/products');
        } else {
            toast.error('Failed to update product', { description: res?.error });
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Edit Product</h2>
                    <p className="text-muted-foreground mt-1">Update product information and details.</p>
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
                                <Input
                                    id="title"
                                    name="title"
                                    required
                                    placeholder="e.g. The Silk Midnight Slip Dress"
                                    className="bg-muted/50"
                                    defaultValue={product.title}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Input
                                    id="shortDescription"
                                    name="shortDescription"
                                    required
                                    placeholder="A brief summary for product cards..."
                                    className="bg-muted/50"
                                    defaultValue={product.shortDescription}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Full Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    className="w-full min-h-[150px] rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Tell the full story of this product. Detail the fabric, the fit, and why it's special..."
                                    defaultValue={product.description}
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
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="bg-muted/50"
                                        defaultValue={product.price}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                    <Input
                                        id="sku"
                                        name="sku"
                                        required
                                        placeholder="DRS-001"
                                        className="bg-muted/50"
                                        defaultValue={product.sku}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Available Stock</Label>
                                    <Input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="bg-muted/50"
                                        defaultValue={product.stock}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        className="w-full h-9 rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        defaultValue={product.category?._id || ''}
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
                            <CardDescription>Update product images.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {product.images?.[0] && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-border/50">
                                    <img src={product.images[0]} alt={product.title} className="w-full aspect-square object-cover" />
                                </div>
                            )}
                            <div className="aspect-square w-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer">
                                <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                                <p className="text-sm font-medium text-foreground">Click to upload</p>
                                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 italic">
                                * Note: Using dummy placeholder until Cloudinary is configured.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status</span>
                                <span className={`text-sm px-2.5 py-1 rounded-full font-semibold ${product.isActive !== false
                                        ? 'text-green-600 bg-green-500/10'
                                        : 'text-gray-600 bg-gray-500/10'
                                    }`}>
                                    {product.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    'Update Product'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
