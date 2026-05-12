'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { createCoupon, deleteCoupon, updateCoupon } from '@/actions/coupon';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

const emptyForm = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    customerEmails: '',
};

export function CouponClient({ coupons: initialCoupons }: { coupons: any[] }) {
    const [coupons, setCoupons] = useState(initialCoupons);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
    const [page, setPage] = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; code: string | null }>({ open: false, id: null, code: null });

    const pageSize = 8;

    const filteredCoupons = useMemo(() => {
        const now = new Date();
        return coupons.filter((coupon) => {
            const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) || (coupon.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            const isExpired = coupon.validUntil && new Date(coupon.validUntil) < now;
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && coupon.isActive && !isExpired) ||
                (statusFilter === 'inactive' && !coupon.isActive) ||
                (statusFilter === 'expired' && isExpired);
            return matchesSearch && matchesStatus;
        });
    }, [coupons, searchTerm, statusFilter]);

    const paginatedCoupons = filteredCoupons.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / pageSize));

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await createCoupon(new FormData(e.currentTarget));
            if (res?.success) {
                toast.success('Coupon created successfully');
                setCoupons([res.data, ...coupons]);
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error('Failed to create coupon', { description: res?.error });
            }
        } finally {
            setIsCreating(false);
        }
    };

    const openEdit = (coupon: any) => {
        setEditingCoupon(coupon);
        setEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingCoupon?._id) return;
        setIsCreating(true);
        try {
            const res = await updateCoupon(editingCoupon._id, new FormData(e.currentTarget));
            if (res?.success) {
                toast.success('Coupon updated successfully');
                setCoupons(coupons.map((coupon) => (coupon._id === editingCoupon._id ? res.data : coupon)));
                setEditOpen(false);
                setEditingCoupon(null);
            } else {
                toast.error('Failed to update coupon', { description: res?.error });
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        setIsDeleting(confirmDelete.id);
        try {
            const res = await deleteCoupon(confirmDelete.id);
            if (res?.success) {
                toast.success('Coupon deleted successfully');
                setCoupons(coupons.filter((coupon) => coupon._id !== confirmDelete.id));
            } else {
                toast.error('Failed to delete coupon', { description: res?.error });
            }
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Coupons</h2>
                    <p className="text-muted-foreground mt-1">Manage discount codes and promotions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-1 border-border/50 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle>Create Coupon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input name="code" required placeholder="COUPON CODE" className="bg-muted/50 uppercase" />
                            <Input name="description" placeholder="Description" className="bg-muted/50" />
                            <select name="discountType" className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                                <option value="free_shipping">Free Shipping</option>
                            </select>
                            <Input name="discountValue" type="number" step="0.01" placeholder="Discount value" className="bg-muted/50" />
                            <Input name="minPurchaseAmount" type="number" step="0.01" placeholder="Minimum order amount" className="bg-muted/50" />
                            <Input name="maxDiscountAmount" type="number" step="0.01" placeholder="Maximum discount" className="bg-muted/50" />
                            <Input name="usageLimit" type="number" placeholder="Usage limit" className="bg-muted/50" />
                            <Input name="validFrom" type="date" className="bg-muted/50" />
                            <Input name="validUntil" type="date" className="bg-muted/50" />
                            <Input name="customerEmails" placeholder="Customer emails comma separated" className="bg-muted/50" />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="autoApply" value="true" id="coupon-autoApply" />
                                <label htmlFor="coupon-autoApply" className="text-sm">Auto apply</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isActive" value="true" id="coupon-active" defaultChecked />
                                <label htmlFor="coupon-active" className="text-sm">Active</label>
                            </div>
                            <Button type="submit" className="w-full" isLoading={isCreating} loadingText="Creating...">
                                <Plus className="mr-2 h-4 w-4" /> Create Coupon
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-2 border-border/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} placeholder="Search coupons..." className="pl-9 bg-muted/50" />
                            </div>
                            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }} className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto rounded-lg border border-border/50">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {paginatedCoupons.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No coupons found.</td></tr>
                                    ) : paginatedCoupons.map((coupon: any) => {
                                        const expired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                                        return (
                                            <tr key={coupon._id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 font-bold tracking-wider">{coupon.code}</td>
                                                <td className="px-6 py-4 capitalize">{coupon.discountType.replace('_', ' ')}</td>
                                                <td className="px-6 py-4">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : coupon.discountType === 'fixed' ? `$${coupon.discountValue}` : 'Free shipping'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive && !expired ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {coupon.isActive && !expired ? 'Active' : expired ? 'Expired' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openEdit(coupon)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete({ open: true, id: coupon._id, code: coupon.code })} disabled={isDeleting === coupon._id}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((currentPage) => (
                                <Button key={currentPage} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setPage(currentPage)}>
                                    {currentPage}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>Edit Coupon</DialogTitle></DialogHeader>
                    {editingCoupon && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <Input name="code" defaultValue={editingCoupon.code} className="uppercase" />
                            <Input name="description" defaultValue={editingCoupon.description} />
                            <select name="discountType" defaultValue={editingCoupon.discountType} className="w-full h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm">
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                                <option value="free_shipping">Free Shipping</option>
                            </select>
                            <Input name="discountValue" type="number" step="0.01" defaultValue={editingCoupon.discountValue} />
                            <Input name="minPurchaseAmount" type="number" step="0.01" defaultValue={editingCoupon.minPurchaseAmount ?? 0} />
                            <Input name="maxDiscountAmount" type="number" step="0.01" defaultValue={editingCoupon.maxDiscountAmount} />
                            <Input name="usageLimit" type="number" defaultValue={editingCoupon.usageLimit} />
                            <Input name="validFrom" type="date" defaultValue={editingCoupon.validFrom ? String(editingCoupon.validFrom).slice(0, 10) : ''} />
                            <Input name="validUntil" type="date" defaultValue={editingCoupon.validUntil ? String(editingCoupon.validUntil).slice(0, 10) : ''} />
                            <Input name="customerEmails" defaultValue={(editingCoupon.customerEmails || []).join(', ')} placeholder="emails comma separated" />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="autoApply" value="true" defaultChecked={editingCoupon.autoApply} />
                                <label className="text-sm">Auto apply</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isActive" value="true" defaultChecked={editingCoupon.isActive} />
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
                onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, code: null })}
                title="Delete Coupon"
                description={`Are you sure you want to delete ${confirmDelete.code || 'this coupon'}?`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting === confirmDelete.id}
            />
        </div>
    );
}
