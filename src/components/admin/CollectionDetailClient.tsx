'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export function CollectionDetailClient({ collection }: { collection: any }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/collections"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Back to collections"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">{collection.title}</h2>
                    <p className="text-muted-foreground">Collection details and assigned products.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1 border-border/50 shadow-sm">
                    <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div><span className="text-muted-foreground">Slug:</span> {collection.slug}</div>
                        <div><span className="text-muted-foreground">Status:</span> {collection.isActive ? 'Active' : 'Inactive'}</div>
                        <div><span className="text-muted-foreground">Featured:</span> {collection.featured ? 'Yes' : 'No'}</div>
                        <div><span className="text-muted-foreground">Sort Order:</span> {collection.sortOrder ?? 0}</div>
                        <div><span className="text-muted-foreground">SEO:</span> {collection.seoTitle || '—'}</div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader><CardTitle>Assigned Products</CardTitle></CardHeader>
                    <CardContent>
                        {collection.products?.length ? (
                            <div className="space-y-3">
                                {collection.products.map((product: any) => (
                                    <div key={product._id} className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
                                        <div>
                                            <p className="font-medium">{product.title || product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.isActive ? 'Active' : 'Inactive'}</p>
                                        </div>
                                        <span className="text-sm font-medium">{product.price ? `$${product.price}` : ''}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-muted-foreground">
                                No products assigned to this collection.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
