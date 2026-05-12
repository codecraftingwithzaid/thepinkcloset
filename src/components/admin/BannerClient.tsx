'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageIcon, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { createBanner, deleteBanner, updateBanner } from '@/actions/banner';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function BannerClient({ banners: initialBanners }: { banners: any[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; title: string | null }>({
    open: false,
    id: null,
    title: null,
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createBanner(formData);
      if (res?.success) {
        toast.success('Banner created successfully');
        setBanners([res.data, ...banners]);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error('Failed to create banner', { description: res?.error });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const openEdit = (banner: any) => {
    setEditingBanner(banner);
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBanner?._id) return;
    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateBanner(editingBanner._id, formData);
      if (res?.success) {
        toast.success('Banner updated successfully');
        setBanners(banners.map((item) => (item._id === editingBanner._id ? res.data : item)));
        setEditOpen(false);
        setEditingBanner(null);
      } else {
        toast.error('Failed to update banner', { description: res?.error });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    setIsDeleting(confirmDelete.id);
    try {
      const res = await deleteBanner(confirmDelete.id);
      if (res?.success) {
        toast.success('Banner deleted');
        setBanners(banners.filter((item) => item._id !== confirmDelete.id));
      } else {
        toast.error('Failed to delete', { description: res?.error });
      }
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Banners</h2>
          <p className="text-muted-foreground mt-1">Manage homepage and promotional banners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1 border-border/50 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Add New Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input name="title" required placeholder="e.g. Summer Sale" className="bg-muted/50" />
              <Input name="subtitle" placeholder="Optional subtitle" className="bg-muted/50" />
              <Input name="image" required placeholder="Desktop image URL" className="bg-muted/50" />
              <Input name="mobileImage" placeholder="Mobile image URL" className="bg-muted/50" />
              <Input name="link" placeholder="/shop" className="bg-muted/50" />
              <Input name="ctaText" placeholder="CTA text" className="bg-muted/50" />
              <Input name="ctaLink" placeholder="CTA link" className="bg-muted/50" />
              <select name="location" className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm" required>
                <option value="hero">Hero Slider</option>
                <option value="announcement">Announcement Bar</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
                <option value="category">Category Banner</option>
                <option value="promo">Promotional Banner</option>
              </select>
              <Input name="order" type="number" placeholder="Display order" className="bg-muted/50" />
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" name="isActive" id="banner-isActive" value="true" defaultChecked />
                <label htmlFor="banner-isActive" className="text-sm">Active</label>
              </div>
              <Button type="submit" className="w-full" isLoading={isCreating} loadingText="Creating...">
                <Plus className="mr-2 h-4 w-4" /> Create Banner
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>All Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {banners.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                  No banners found.
                </div>
              ) : (
                banners.map((banner: any) => (
                  <div key={banner._id} className="relative group rounded-xl border border-border/50 overflow-hidden bg-card hover:shadow-md transition-all">
                    <div className="aspect-video w-full bg-muted relative">
                      {banner.image ? (
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEdit(banner)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setConfirmDelete({ open: true, id: banner._id, title: banner.title })}
                          disabled={isDeleting === banner._id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold truncate">{banner.title}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{banner.subtitle || 'No subtitle'}</p>
                      <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">{banner.location}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          {editingBanner && (
            <form onSubmit={handleEdit} className="space-y-4">
              <Input name="title" defaultValue={editingBanner.title} placeholder="Title" />
              <Input name="subtitle" defaultValue={editingBanner.subtitle} placeholder="Subtitle" />
              <Input name="image" defaultValue={editingBanner.image} placeholder="Desktop image URL" />
              <Input name="mobileImage" defaultValue={editingBanner.mobileImage} placeholder="Mobile image URL" />
              <Input name="link" defaultValue={editingBanner.link} placeholder="Link" />
              <Input name="ctaText" defaultValue={editingBanner.ctaText} placeholder="CTA text" />
              <Input name="ctaLink" defaultValue={editingBanner.ctaLink} placeholder="CTA link" />
              <select name="location" defaultValue={editingBanner.location} className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                <option value="hero">Hero Slider</option>
                <option value="announcement">Announcement Bar</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
                <option value="category">Category Banner</option>
                <option value="promo">Promotional Banner</option>
              </select>
              <Input name="order" type="number" defaultValue={editingBanner.order ?? 0} placeholder="Display order" />
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" value="true" defaultChecked={editingBanner.isActive} />
                <label className="text-sm">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isCreating}>Cancel</Button>
                <Button type="submit" isLoading={isCreating} loadingText="Saving...">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmDelete.open}
        onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, title: null })}
        title="Delete Banner"
        description={`Are you sure you want to delete ${confirmDelete.title || 'this banner'}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting === confirmDelete.id}
      />
    </div>
  );
}
