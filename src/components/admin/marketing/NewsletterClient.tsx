'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { deleteNewsletter, subscribeNewsletter, unsubscribeNewsletter } from '@/actions/newsletter';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function NewsletterClient({ subscribers: initialSubscribers, stats }: { subscribers: any[]; stats: any }) {
    const [subscribers, setSubscribers] = useState(initialSubscribers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [page, setPage] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; email: string | null }>({ open: false, id: null, email: null });
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const pageSize = 10;

    const filtered = useMemo(() => {
        return subscribers.filter((subscriber) => {
            const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && subscriber.isActive) || (statusFilter === 'inactive' && !subscriber.isActive);
            return matchesSearch && matchesStatus;
        });
    }, [subscribers, searchTerm, statusFilter]);

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsAdding(true);
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get('email') || '').trim();
        if (!email) {
            setIsAdding(false);
            return;
        }
        const tags = String(formData.get('tags') || '').split(',').map((value) => value.trim()).filter(Boolean);
        const res = await subscribeNewsletter(email, tags);
        if (res?.success) {
            toast.success('Subscriber added');
            setSubscribers([res.data, ...subscribers]);
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error('Failed to add subscriber', { description: res?.error });
        }
        setIsAdding(false);
    };

    const handleToggle = async (subscriber: any) => {
        const res = subscriber.isActive ? await unsubscribeNewsletter(subscriber.email) : await subscribeNewsletter(subscriber.email, subscriber.tags || []);
        if (res?.success) {
            toast.success(subscriber.isActive ? 'Subscriber unsubscribed' : 'Subscriber reactivated');
            setSubscribers(subscribers.map((item) => (item._id === subscriber._id ? res.data : item)));
        } else {
            toast.error('Failed to update subscriber', { description: res?.error });
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        setIsDeleting(confirmDelete.id);
        const res = await deleteNewsletter(confirmDelete.id);
        if (res?.success) {
            toast.success('Subscriber deleted');
            setSubscribers(subscribers.filter((item) => item._id !== confirmDelete.id));
        } else {
            toast.error('Failed to delete subscriber', { description: res?.error });
        }
        setIsDeleting(null);
    };

    const exportCsv = () => {
        const rows = [['Email', 'Status', 'Subscribed At']].concat(filtered.map((subscriber) => [subscriber.email, subscriber.isActive ? 'Active' : 'Inactive', new Date(subscriber.subscribedAt).toLocaleString()]));
        const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'newsletter-subscribers.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Newsletter</h2>
                <p className="text-muted-foreground mt-1">Manage subscribers and exports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardHeader><CardTitle className="text-sm">Total</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats?.total ?? 0}</CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-600">{stats?.active ?? 0}</CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm">Inactive</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-red-600">{stats?.inactive ?? 0}</CardContent></Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-1 border-border/50 shadow-sm h-fit">
                    <CardHeader><CardTitle>Add Subscriber</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <Input name="email" type="email" placeholder="subscriber@example.com" required className="bg-muted/50" />
                            <Input name="tags" placeholder="Tags comma separated" className="bg-muted/50" />
                            <Button type="submit" className="w-full" disabled={isAdding}>{isAdding ? 'Adding...' : <><Plus className="mr-2 h-4 w-4" /> Add Subscriber</>}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-2 border-border/50 shadow-sm">
                    <CardHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search subscribers..." className="pl-9 bg-muted/50" />
                            </div>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Button type="button" variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> Export</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto rounded-lg border border-border/50">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Subscribed</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {paginated.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No subscribers found.</td></tr>
                                    ) : paginated.map((subscriber: any) => (
                                        <tr key={subscriber._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{subscriber.email}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${subscriber.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>{subscriber.isActive ? 'Active' : 'Inactive'}</span></td>
                                            <td className="px-6 py-4 text-muted-foreground">{new Date(subscriber.subscribedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleToggle(subscriber)}>{subscriber.isActive ? 'Unsubscribe' : 'Reactivate'}</Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete({ open: true, id: subscriber._id, email: subscriber.email })} disabled={isDeleting === subscriber._id}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((currentPage) => (
                                <Button key={currentPage} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setPage(currentPage)}>{currentPage}</Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                open={confirmDelete.open}
                onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, email: null })}
                title="Delete Subscriber"
                description={`Are you sure you want to delete ${confirmDelete.email || 'this subscriber'}?`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting === confirmDelete.id}
            />
        </div>
    );
}
