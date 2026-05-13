'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { createCollection, deleteCollection, updateCollection } from '@/actions/collection';
import { startGlobalLoading, stopGlobalLoading } from '@/store/useLoadingStore';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function CollectionClient({ collections: initialCollections }: { collections: any[] }) {
  const router = useRouter();
  const [collections, setCollections] = useState(initialCollections);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; title: string | null }>({
    open: false,
    id: null,
    title: null,
  });

  const filteredCollections = useMemo(() => {
    return collections.filter((collection) => {
      const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) || (collection.slug || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && collection.isActive) ||
        (statusFilter === 'inactive' && !collection.isActive) ||
        (statusFilter === 'featured' && collection.featured);
      return matchesSearch && matchesStatus;
    });
  }, [collections, searchTerm, statusFilter]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    startGlobalLoading('Creating collection...')
    const formData = new FormData(e.currentTarget);
    const res = await createCollection(formData);
    if (res?.success) {
      toast.success('Collection created successfully');
      setCollections([res.data, ...collections]);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error('Failed to create collection', { description: res?.error });
    }
    setIsCreating(false);
    stopGlobalLoading()
  };

  const openEditDialog = (collection: any) => {
    setEditingCollection(collection);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCollection?._id) return;
    startGlobalLoading('Updating collection...')
    const formData = new FormData(e.currentTarget);
    const res = await updateCollection(editingCollection._id, formData);
    if (res?.success) {
      toast.success('Collection updated successfully');
      setCollections(collections.map((item) => (item._id === editingCollection._id ? res.data : item)));
      setEditDialogOpen(false);
      setEditingCollection(null);
    } else {
      toast.error('Failed to update collection', { description: res?.error });
    }
    stopGlobalLoading()
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    setIsDeleting(confirmDelete.id);
    startGlobalLoading('Deleting collection...')
    const res = await deleteCollection(confirmDelete.id);
    if (res?.success) {
      toast.success('Collection deleted');
      setCollections(collections.filter((item) => item._id !== confirmDelete.id));
    } else {
      toast.error('Failed to delete collection', { description: res?.error });
    }
    setIsDeleting(null);
    stopGlobalLoading()
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Collections</h2>
          <p className="text-muted-foreground mt-1">Group products into featured collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-border/50 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Add Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Collection Title</label>
                <Input name="title" required placeholder="e.g. Summer Edit" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input name="description" placeholder="Optional description" className="bg-muted/50" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Input name="image" placeholder="Banner image URL" className="bg-muted/50" />
                <Input name="featuredImage" placeholder="Featured image URL" className="bg-muted/50" />
                <Input name="bannerImage" placeholder="Desktop banner URL" className="bg-muted/50" />
                <Input name="seoTitle" placeholder="SEO title" className="bg-muted/50" />
                <Input name="seoDescription" placeholder="SEO description" className="bg-muted/50" />
                <Input name="sortOrder" type="number" placeholder="Sort order" className="bg-muted/50" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" id="collection-isActive" value="true" defaultChecked />
                <label htmlFor="collection-isActive" className="text-sm">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" id="collection-featured" value="true" />
                <label htmlFor="collection-featured" className="text-sm">Featured on Homepage</label>
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? 'Creating...' : <><Plus className="mr-2 h-4 w-4" /> Create Collection</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <CardTitle>All Collections</CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collections..."
                    className="pl-9 bg-muted/50 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCollections.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No collections found.
                      </td>
                    </tr>
                  ) : (
                    filteredCollections.map((collection: any) => (
                      <tr key={collection._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{collection.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${collection.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                            {collection.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{collection.featured ? 'Yes' : 'No'}</td>
                        <td className="px-6 py-4">{collection.sortOrder ?? 0}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={async () => { startGlobalLoading(); await router.push(`/admin/collections/${collection._id}`); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openEditDialog(collection)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => setConfirmDelete({ open: true, id: collection._id, title: collection.title })}
                              disabled={isDeleting === collection._id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          {editingCollection && (
            <form onSubmit={handleUpdate} className="grid gap-4">
              <Input name="title" defaultValue={editingCollection.title} placeholder="Collection title" />
              <Input name="slug" defaultValue={editingCollection.slug} placeholder="Slug" />
              <Input name="description" defaultValue={editingCollection.description} placeholder="Description" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input name="image" defaultValue={editingCollection.image} placeholder="Image URL" />
                <Input name="featuredImage" defaultValue={editingCollection.featuredImage} placeholder="Featured image URL" />
                <Input name="bannerImage" defaultValue={editingCollection.bannerImage} placeholder="Banner image URL" />
                <Input name="seoTitle" defaultValue={editingCollection.seoTitle} placeholder="SEO title" />
              </div>
              <Input name="seoDescription" defaultValue={editingCollection.seoDescription} placeholder="SEO description" />
              <Input name="sortOrder" type="number" defaultValue={editingCollection.sortOrder ?? 0} placeholder="Sort order" />
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" value="true" defaultChecked={editingCollection.isActive} />
                <label className="text-sm">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" value="true" defaultChecked={editingCollection.featured} />
                <label className="text-sm">Featured</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmDelete.open}
        onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, title: null })}
        title="Delete Collection"
        description={`Are you sure you want to delete ${confirmDelete.title || 'this collection'}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting === confirmDelete.id}
      />
    </div>
  );
}
