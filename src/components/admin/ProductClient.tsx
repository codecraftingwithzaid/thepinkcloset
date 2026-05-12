'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, MoreHorizontal, Power } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProduct, updateProductStatus } from '@/actions/product';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

export function ProductClient({ products: initialProducts }: { products: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'delete' | 'toggle' | null;
    productId: string | null;
    productTitle: string | null;
    productStatus: boolean | null;
  }>({
    open: false,
    type: null,
    productId: null,
    productTitle: null,
    productStatus: null,
  });

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteConfirm = (id: string, title: string) => {
    setConfirmDialog({
      open: true,
      type: 'delete',
      productId: id,
      productTitle: title,
      productStatus: null,
    });
  };

  const openToggleStatusConfirm = (id: string, title: string, isActive: boolean | undefined) => {
    const currentStatus = isActive !== false; // Treat undefined/missing as true (default)
    setConfirmDialog({
      open: true,
      type: 'toggle',
      productId: id,
      productTitle: title,
      productStatus: currentStatus,
    });
  };

  const handleDelete = async () => {
    if (!confirmDialog.productId) return;

    setIsDeleting(confirmDialog.productId);
    const res = await deleteProduct(confirmDialog.productId);
    if (res?.success) {
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p._id !== confirmDialog.productId));
      router.refresh();
    } else {
      toast.error('Failed to delete product', { description: res?.error });
    }
    setIsDeleting(null);
  };

  const handleToggleStatus = async () => {
    if (!confirmDialog.productId || confirmDialog.productStatus === null) return;

    setIsTogglingStatus(confirmDialog.productId);
    const newStatus = !confirmDialog.productStatus;
    const res = await updateProductStatus(confirmDialog.productId, newStatus);
    if (res?.success) {
      // Update local state immediately
      setProducts(products.map(p =>
        p._id === confirmDialog.productId
          ? { ...p, isActive: newStatus }
          : p
      ));
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
      router.refresh();
    } else {
      toast.error('Failed to update product status', { description: res?.error });
    }
    setIsTogglingStatus(null);
  };

  const handleEditClick = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-1">Manage your store's products and variants.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Products</CardTitle>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 bg-muted/50 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No products found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                We couldn't find any products matching your search. Try adjusting your filters or add a new product.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredProducts.map((product: any) => (
                    <tr key={product._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-border/50" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                              <span className="text-muted-foreground text-xs font-medium">No img</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{product.title}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{product.category?.name || 'Uncategorized'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${product.stock > 10 ? 'bg-green-500/10 text-green-600' :
                              product.stock > 0 ? 'bg-orange-500/10 text-orange-600' :
                                'bg-red-500/10 text-red-600'
                            }`}>
                            {product.stock > 10 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                          {product.isActive === false && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-500/10 text-gray-600">
                              Disabled
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Product actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEditClick(product._id)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openToggleStatusConfirm(product._id, product.title, product.isActive)}
                                disabled={isTogglingStatus === product._id}
                              >
                                <Power className="mr-2 h-4 w-4" />
                                {isTogglingStatus === product._id ? 'Updating...' : (product.isActive !== false ? 'Deactivate' : 'Activate')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => openDeleteConfirm(product._id, product.title)}
                                disabled={isDeleting === product._id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting === product._id ? 'Deleting...' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({
              open: false,
              type: null,
              productId: null,
              productTitle: null,
              productStatus: null,
            });
          }
        }}
        title={confirmDialog.type === 'delete' ? 'Delete Product' : 'Change Product Status'}
        description={
          confirmDialog.type === 'delete'
            ? `Are you sure you want to delete "${confirmDialog.productTitle}"? This action cannot be undone.`
            : `${confirmDialog.productStatus ? 'Deactivate' : 'Activate'} "${confirmDialog.productTitle}"?`
        }
        confirmText={confirmDialog.type === 'delete' ? 'Delete' : (confirmDialog.productStatus ? 'Deactivate' : 'Activate')}
        cancelText="Cancel"
        variant={confirmDialog.type === 'delete' ? 'destructive' : 'default'}
        onConfirm={confirmDialog.type === 'delete' ? handleDelete : handleToggleStatus}
        isLoading={
          confirmDialog.type === 'delete'
            ? isDeleting === confirmDialog.productId
            : isTogglingStatus === confirmDialog.productId
        }
      />
    </div>
  );
}
