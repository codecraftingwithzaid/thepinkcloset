'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory, updateCategory, deleteCategory } from '@/actions/category';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CategoryClient({ categories: initialCategories }: { categories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    categoryId: string | null;
    categoryName: string | null;
  }>({
    open: false,
    categoryId: null,
    categoryName: null,
  });

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim();
    if (!name) { setIsCreating(false); return; }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const res = await createCategory({ name, slug });
    if (res?.success) {
      toast.success('Category created successfully');
      setCategories([...categories, res.category]);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error('Failed to create category');
    }
    setIsCreating(false);
  };

  const handleEditOpen = (category: any) => {
    setEditingCategory(category);
    setEditName(category.name);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    const slug = editName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const res = await updateCategory(editingCategory._id, {
      name: editName,
      slug: slug,
    });

    if (res?.success) {
      toast.success('Category updated successfully');
      setCategories(categories.map(c => c._id === editingCategory._id ? res.category : c));
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    } else {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteOpen = (category: any) => {
    setDeleteConfirm({
      open: true,
      categoryId: category._id,
      categoryName: category.name,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.categoryId) return;

    setIsDeleting(deleteConfirm.categoryId);
    const res = await deleteCategory(deleteConfirm.categoryId);

    if (res?.success) {
      toast.success('Category deleted successfully');
      setCategories(categories.filter(c => c._id !== deleteConfirm.categoryId));
    } else {
      toast.error('Failed to delete category');
    }

    setIsDeleting(null);
    setDeleteConfirm({ open: false, categoryId: null, categoryName: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground mt-1">Organize your products into categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-border/50 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input name="name" required placeholder="e.g. Dresses" className="bg-muted/50" />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? 'Creating...' : <><Plus className="mr-2 h-4 w-4" /> Create Category</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Categories</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  className="pl-9 bg-muted/50 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat: any) => (
                      <tr key={cat._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen && editingCategory?._id === cat._id} onOpenChange={(open) => {
                            if (!open) {
                              setIsEditDialogOpen(false);
                              setEditingCategory(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground"
                                onClick={() => handleEditOpen(cat)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Category Name</label>
                                  <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Category name"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsEditDialogOpen(false);
                                      setEditingCategory(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditSave}>
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteOpen(cat)}
                            disabled={isDeleting === cat._id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirm({ open: false, categoryId: null, categoryName: null });
          }
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteConfirm.categoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting === deleteConfirm.categoryId}
      />
    </div>
  );
}
