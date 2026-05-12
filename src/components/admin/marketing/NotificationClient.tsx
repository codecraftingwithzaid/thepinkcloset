'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Trash2, MailOpen, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { createNotification, deleteNotification, markAsRead, markAsUnread } from '@/actions/notification';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function NotificationClient({ notifications: initialNotifications }: { notifications: any[] }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'system' | 'customer' | 'alert' | 'inventory' | 'payment' | 'review'>('all');
    const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
    const [page, setPage] = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; title: string | null }>({ open: false, id: null, title: null });
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const pageSize = 8;

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesSearch = [notification.title, notification.message, notification.type].some((value) => String(value || '').toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = typeFilter === 'all' || notification.type === typeFilter;
            const matchesRead = readFilter === 'all' || (readFilter === 'read' && notification.isRead) || (readFilter === 'unread' && !notification.isRead);
            return matchesSearch && matchesType && matchesRead;
        });
    }, [notifications, searchTerm, typeFilter, readFilter]);

    const paginated = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);
        const res = await createNotification(String(formData.get('title') || ''), String(formData.get('message') || ''), formData.get('type') as any, String(formData.get('link') || '') || undefined);
        if (res?.success) {
            toast.success('Notification created');
            setNotifications([res.data, ...notifications]);
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error('Failed to create notification', { description: res?.error });
        }
        setIsCreating(false);
    };

    const toggleRead = async (notification: any) => {
        const res = notification.isRead ? await markAsUnread(notification._id) : await markAsRead(notification._id);
        if (res?.success) {
            toast.success(notification.isRead ? 'Marked unread' : 'Marked read');
            setNotifications(notifications.map((item) => (item._id === notification._id ? { ...item, isRead: !notification.isRead } : item)));
        } else {
            toast.error('Failed to update notification', { description: res?.error });
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        setIsDeleting(confirmDelete.id);
        const res = await deleteNotification(confirmDelete.id);
        if (res?.success) {
            toast.success('Notification deleted');
            setNotifications(notifications.filter((item) => item._id !== confirmDelete.id));
        } else {
            toast.error('Failed to delete notification', { description: res?.error });
        }
        setIsDeleting(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Notifications</h2>
                <p className="text-muted-foreground mt-1">Manage admin notifications and alerts.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-1 border-border/50 shadow-sm h-fit">
                    <CardHeader><CardTitle>Create Notification</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input name="title" placeholder="Title" required className="bg-muted/50" />
                            <Input name="message" placeholder="Message" required className="bg-muted/50" />
                            <select name="type" className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="order">Order</option>
                                <option value="customer">Customer</option>
                                <option value="inventory">Inventory</option>
                                <option value="payment">Payment</option>
                                <option value="review">Review</option>
                                <option value="system">System</option>
                                <option value="alert">Alert</option>
                            </select>
                            <Input name="link" placeholder="Optional link" className="bg-muted/50" />
                            <Button type="submit" className="w-full" disabled={isCreating}>{isCreating ? 'Creating...' : <><Plus className="mr-2 h-4 w-4" /> Create Notification</>}</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-2 border-border/50 shadow-sm">
                    <CardHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_150px] gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search notifications..." className="pl-9 bg-muted/50" />
                            </div>
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="all">All Types</option>
                                <option value="order">Order</option>
                                <option value="customer">Customer</option>
                                <option value="inventory">Inventory</option>
                                <option value="payment">Payment</option>
                                <option value="review">Review</option>
                                <option value="system">System</option>
                                <option value="alert">Alert</option>
                            </select>
                            <select value={readFilter} onChange={(e) => setReadFilter(e.target.value as any)} className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="all">All</option>
                                <option value="read">Read</option>
                                <option value="unread">Unread</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto rounded-lg border border-border/50">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {paginated.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No notifications found.</td></tr>
                                    ) : paginated.map((notification: any) => (
                                        <tr key={notification._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{notification.title}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">{notification.message}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">{notification.type}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.isRead ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>{notification.isRead ? 'Read' : 'Unread'}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => toggleRead(notification)}>{notification.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}</Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete({ open: true, id: notification._id, title: notification.title })} disabled={isDeleting === notification._id}><Trash2 className="h-4 w-4" /></Button>
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
                onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, title: null })}
                title="Delete Notification"
                description={`Are you sure you want to delete ${confirmDelete.title || 'this notification'}?`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting === confirmDelete.id}
            />
        </div>
    );
}
