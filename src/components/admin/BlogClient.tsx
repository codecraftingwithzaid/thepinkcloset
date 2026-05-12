'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { createBlog, deleteBlog, updateBlog } from '@/actions/blog';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function BlogClient({ blogs: initialBlogs }: { blogs: any[] }) {
    const [blogs, setBlogs] = useState(initialBlogs);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; title: string | null }>({ open: false, id: null, title: null });

    const filteredBlogs = useMemo(() => {
        return blogs.filter((blog) => {
            const matchesSearch = [blog.title, blog.slug, blog.category, blog.author].some((value) => String(value || '').toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [blogs, searchTerm, statusFilter]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const res = await createBlog(new FormData(e.currentTarget));
        if (res?.success) {
            toast.success('Blog post created successfully');
            setBlogs([res.data, ...blogs]);
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error('Failed to create blog post', { description: res?.error });
        }
        setIsCreating(false);
    };

    const handleEditOpen = (blog: any) => {
        setEditingBlog(blog);
        setEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingBlog?._id) return;
        const res = await updateBlog(editingBlog._id, new FormData(e.currentTarget));
        if (res?.success) {
            toast.success('Blog post updated successfully');
            setBlogs(blogs.map((blog) => (blog._id === editingBlog._id ? res.data : blog)));
            setEditOpen(false);
            setEditingBlog(null);
        } else {
            toast.error('Failed to update blog post', { description: res?.error });
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        setIsDeleting(confirmDelete.id);
        const res = await deleteBlog(confirmDelete.id);
        if (res?.success) {
            toast.success('Blog deleted successfully');
            setBlogs(blogs.filter((blog) => blog._id !== confirmDelete.id));
        } else {
            toast.error('Failed to delete blog post', { description: res?.error });
        }
        setIsDeleting(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Blogs & CMS</h2>
                <p className="text-muted-foreground mt-1">Manage content, articles, and SEO pages.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-1 border-border/50 shadow-sm h-fit">
                    <CardHeader><CardTitle>Create Blog Post</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input name="title" placeholder="Title" required className="bg-muted/50" />
                            <Textarea name="excerpt" placeholder="Short excerpt" className="bg-muted/50 min-h-[90px]" />
                            <Textarea name="content" placeholder="Content" required className="bg-muted/50 min-h-[180px]" />
                            <Input name="coverImage" placeholder="Cover image URL" className="bg-muted/50" />
                            <Input name="featuredImage" placeholder="Featured image URL" className="bg-muted/50" />
                            <Input name="metaTitle" placeholder="Meta title" className="bg-muted/50" />
                            <Textarea name="metaDescription" placeholder="Meta description" className="bg-muted/50 min-h-[90px]" />
                            <Input name="tags" placeholder="Tags comma separated" className="bg-muted/50" />
                            <Input name="category" placeholder="Category" className="bg-muted/50" />
                            <Input name="author" placeholder="Author" className="bg-muted/50" />
                            <Input name="readingTime" type="number" placeholder="Reading time (min)" className="bg-muted/50" />
                            <Input name="publishedAt" type="date" className="bg-muted/50" />
                            <select name="status" className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="featured" value="true" id="blog-featured" />
                                <label htmlFor="blog-featured" className="text-sm">Featured</label>
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>{isCreating ? 'Creating...' : <><Plus className="mr-2 h-4 w-4" /> Publish Post</>}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-2 border-border/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search blogs..." className="pl-9 bg-muted/50" />
                            </div>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="all">All</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto rounded-lg border border-border/50">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Featured</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredBlogs.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No posts found.</td></tr>
                                    ) : filteredBlogs.map((blog: any) => (
                                        <tr key={blog._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">{blog.title}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.status === 'published' ? 'bg-green-500/10 text-green-600' : blog.status === 'draft' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-muted text-muted-foreground'}`}>{blog.status}</span></td>
                                            <td className="px-6 py-4">{blog.category}</td>
                                            <td className="px-6 py-4">{blog.featured ? 'Yes' : 'No'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleEditOpen(blog)}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete({ open: true, id: blog._id, title: blog.title })} disabled={isDeleting === blog._id}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader><DialogTitle>Edit Blog Post</DialogTitle></DialogHeader>
                    {editingBlog && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <Input name="title" defaultValue={editingBlog.title} placeholder="Title" />
                            <Input name="slug" defaultValue={editingBlog.slug} placeholder="Slug" />
                            <Textarea name="excerpt" defaultValue={editingBlog.excerpt} placeholder="Excerpt" className="min-h-[90px]" />
                            <Textarea name="content" defaultValue={editingBlog.content} placeholder="Content" className="min-h-[180px]" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input name="coverImage" defaultValue={editingBlog.coverImage} placeholder="Cover image URL" />
                                <Input name="featuredImage" defaultValue={editingBlog.featuredImage} placeholder="Featured image URL" />
                                <Input name="metaTitle" defaultValue={editingBlog.metaTitle} placeholder="Meta title" />
                                <Input name="category" defaultValue={editingBlog.category} placeholder="Category" />
                            </div>
                            <Textarea name="metaDescription" defaultValue={editingBlog.metaDescription} placeholder="Meta description" className="min-h-[90px]" />
                            <Input name="tags" defaultValue={(editingBlog.tags || []).join(', ')} placeholder="Tags comma separated" />
                            <Input name="author" defaultValue={editingBlog.author} placeholder="Author" />
                            <Input name="readingTime" type="number" defaultValue={editingBlog.readingTime ?? 0} placeholder="Reading time" />
                            <Input name="publishedAt" type="date" defaultValue={editingBlog.publishedAt ? String(editingBlog.publishedAt).slice(0, 10) : ''} />
                            <select name="status" defaultValue={editingBlog.status} className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="featured" value="true" defaultChecked={editingBlog.featured} />
                                <label className="text-sm">Featured</label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={confirmDelete.open}
                onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, title: null })}
                title="Delete Blog Post"
                description={`Are you sure you want to delete ${confirmDelete.title || 'this blog post'}?`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting === confirmDelete.id}
            />
        </div>
    );
}
