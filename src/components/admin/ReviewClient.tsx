'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Trash2, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { deleteReview, replyToReview, updateReviewStatus } from '@/actions/review';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Textarea } from '@/components/ui/textarea';

export function ReviewClient({ reviews: initialReviews }: { reviews: any[] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'reported'>('all');
    const [page, setPage] = useState(1);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyReview, setReplyReview] = useState<any>(null);
    const [replyText, setReplyText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; product: string | null }>({ open: false, id: null, product: null });
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const pageSize = 8;

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const matchesSearch = [review.comment, review.status, review.product?.name, review.user?.name, review.user?.email].some((value) => String(value || '').toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'reported' ? review.reported : review.status === statusFilter);
            return matchesSearch && matchesStatus;
        });
    }, [reviews, searchTerm, statusFilter]);

    const paginated = filteredReviews.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));

    const setStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
        const res = await updateReviewStatus(id, status);
        if (res?.success) {
            toast.success(`Review ${status}`);
            setReviews(reviews.map((review) => (review._id === id ? { ...review, status } : review)));
        } else {
            toast.error('Failed to update review', { description: res?.error });
        }
    };

    const handleReply = async () => {
        if (!replyReview?._id || !replyText.trim()) return;
        const res = await replyToReview(replyReview._id, replyText.trim());
        if (res?.success) {
            toast.success('Reply saved');
            setReviews(reviews.map((review) => (review._id === replyReview._id ? res.data : review)));
            setReplyOpen(false);
            setReplyReview(null);
            setReplyText('');
        } else {
            toast.error('Failed to save reply', { description: res?.error });
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        setIsDeleting(confirmDelete.id);
        const res = await deleteReview(confirmDelete.id);
        if (res?.success) {
            toast.success('Review deleted');
            setReviews(reviews.filter((review) => review._id !== confirmDelete.id));
        } else {
            toast.error('Failed to delete review', { description: res?.error });
        }
        setIsDeleting(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Reviews</h2>
                <p className="text-muted-foreground mt-1">Moderate customer reviews and replies.</p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} placeholder="Search reviews..." className="pl-9 bg-muted/50" />
                        </div>
                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }} className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="reported">Reported</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border border-border/50">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No reviews found.</td></tr>
                                ) : paginated.map((review: any) => (
                                    <tr key={review._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                                                <span className="text-xs text-muted-foreground">{review.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{review.product?.name}</td>
                                        <td className="px-6 py-4">{review.rating}/5</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${review.status === 'approved' ? 'bg-green-500/10 text-green-600' : review.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-yellow-500/10 text-yellow-600'}`}>{review.status}</span>{review.reported ? <span className="ml-2 text-xs text-destructive">Reported</span> : null}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => setStatus(review._id, 'approved')}><CheckCircle2 className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600" onClick={() => setStatus(review._id, 'rejected')}><XCircle className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => { setReplyReview(review); setReplyText(review.reply || ''); setReplyOpen(true); }}><MessageSquare className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete({ open: true, id: review._id, product: review.product?.name })} disabled={isDeleting === review._id}><Trash2 className="h-4 w-4" /></Button>
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

            <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Reply to Review</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply..." className="min-h-[160px]" />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setReplyOpen(false)}>Cancel</Button>
                            <Button onClick={handleReply}>Save Reply</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={confirmDelete.open}
                onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, product: null })}
                title="Delete Review"
                description={`Are you sure you want to delete the review for ${confirmDelete.product || 'this product'}?`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting === confirmDelete.id}
            />
        </div>
    );
}
