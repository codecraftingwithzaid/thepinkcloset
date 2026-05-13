'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Search, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { deleteCustomer, updateCustomerStatus } from '@/actions/customer';
import { startGlobalLoading, stopGlobalLoading } from '@/store/useLoadingStore';
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

interface CustomerListProps {
    customers: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export function CustomerListClient({ customers: initialCustomers, pagination }: CustomerListProps) {
    const router = useRouter();
    const [customers, setCustomers] = useState(initialCustomers);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'delete' | 'status' | null;
        customerId: string | null;
        customerName: string | null;
        newStatus: string | null;
    }>({
        open: false,
        type: null,
        customerId: null,
        customerName: null,
        newStatus: null,
    });

    const handleSearch = async (value: string) => {
        setSearchTerm(value);
        const params = new URLSearchParams();
        params.set('search', value);
        if (statusFilter) params.set('status', statusFilter);
        startGlobalLoading('Searching...')
        await router.push(`/admin/customers?${params.toString()}`);
        // Route change listener in RootLayoutClient will stop loader
    };

    const handleStatusFilter = async (value: string) => {
        setStatusFilter(value);
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (value) params.set('status', value);
        startGlobalLoading('Filtering...')
        await router.push(`/admin/customers?${params.toString()}`);
        // Route change listener in RootLayoutClient will stop loader
    };

    const openDeleteConfirm = (id: string, name: string) => {
        setConfirmDialog({
            open: true,
            type: 'delete',
            customerId: id,
            customerName: name,
            newStatus: null,
        });
    };

    const openStatusConfirm = (id: string, name: string, newStatus: string) => {
        setConfirmDialog({
            open: true,
            type: 'status',
            customerId: id,
            customerName: name,
            newStatus,
        });
    };

    const handleDelete = async () => {
        if (!confirmDialog.customerId) return;

        setIsDeleting(confirmDialog.customerId);
        const res = await deleteCustomer(confirmDialog.customerId);
        if (res?.success) {
            toast.success('Customer deleted successfully');
            setCustomers(customers.filter(c => c._id !== confirmDialog.customerId));
        } else {
            toast.error('Failed to delete customer', { description: res?.error });
        }
        setIsDeleting(null);
    };

    const handleStatusChange = async () => {
        if (!confirmDialog.customerId || !confirmDialog.newStatus) return;

        const res = await updateCustomerStatus(
            confirmDialog.customerId,
            confirmDialog.newStatus as 'active' | 'blocked' | 'suspended'
        );

        if (res?.success) {
            toast.success(`Customer ${confirmDialog.newStatus}`);
            setCustomers(
                customers.map(c =>
                    c._id === confirmDialog.customerId ? { ...c, status: confirmDialog.newStatus } : c
                )
            );
        } else {
            toast.error('Failed to update customer status', { description: res?.error });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-600';
            case 'blocked':
                return 'bg-red-500/10 text-red-600';
            case 'suspended':
                return 'bg-orange-500/10 text-orange-600';
            default:
                return 'bg-gray-500/10 text-gray-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your customers and view their details.
                    </p>
                </div>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="space-y-4">
                        <CardTitle>All Customers</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customers..."
                                    className="pl-9 bg-muted/50"
                                    value={searchTerm}
                                    onChange={e => handleSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="h-9 rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={statusFilter}
                                onChange={e => handleStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {customers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No customers found</p>
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto rounded-lg border border-border/50">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Orders</th>
                                        <th className="px-6 py-4">Total Spent</th>
                                        <th className="px-6 py-4">Last Login</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {customers.map((customer: any) => (
                                        <tr key={customer._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {customer.image ? (
                                                        <img
                                                            src={customer.image}
                                                            alt={customer.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                            <span className="text-xs font-medium">
                                                                {customer.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{customer.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        <span className="truncate max-w-xs">{customer.email}</span>
                                                    </div>
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                                            <span>{customer.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(
                                                        customer.status
                                                    )}`}
                                                >
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium">{customer.totalOrders}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium">${customer.totalSpent?.toFixed(2) || '0.00'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {customer.lastLogin
                                                    ? new Date(customer.lastLogin).toLocaleDateString()
                                                    : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        aria-label="Customer actions"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56">
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={async () => { startGlobalLoading(); await router.push(`/admin/customers/${customer._id}`); }}
                                                            >
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel className="text-xs">Change Status</DropdownMenuLabel>
                                                            {customer.status !== 'active' && (
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-500/10"
                                                                    onClick={() => openStatusConfirm(customer._id, customer.name, 'active')}
                                                                >
                                                                    Activate
                                                                </DropdownMenuItem>
                                                            )}
                                                            {customer.status !== 'blocked' && (
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10"
                                                                    onClick={() => openStatusConfirm(customer._id, customer.name, 'blocked')}
                                                                >
                                                                    Block
                                                                </DropdownMenuItem>
                                                            )}
                                                            {customer.status !== 'suspended' && (
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-500/10"
                                                                    onClick={() => openStatusConfirm(customer._id, customer.name, 'suspended')}
                                                                >
                                                                    Suspend
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                                                onClick={() => openDeleteConfirm(customer._id, customer.name)}
                                                                disabled={isDeleting === customer._id}
                                                            >
                                                                {isDeleting === customer._id ? 'Deleting...' : 'Delete'}
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

                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border/50">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    variant={pagination.page === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={async () => {
                                        const params = new URLSearchParams();
                                        params.set('page', page.toString());
                                        if (searchTerm) params.set('search', searchTerm);
                                        if (statusFilter) params.set('status', statusFilter);
                                        startGlobalLoading();
                                        await router.push(`/admin/customers?${params.toString()}`);
                                        // Route change listener in RootLayoutClient will stop loader
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={confirmDialog.open}
                onOpenChange={open => {
                    if (!open) {
                        setConfirmDialog({
                            open: false,
                            type: null,
                            customerId: null,
                            customerName: null,
                            newStatus: null,
                        });
                    }
                }}
                title={
                    confirmDialog.type === 'delete'
                        ? 'Delete Customer'
                        : `Change Status to ${confirmDialog.newStatus}`
                }
                description={
                    confirmDialog.type === 'delete'
                        ? `Are you sure you want to delete "${confirmDialog.customerName}"? This action cannot be undone.`
                        : `Change "${confirmDialog.customerName}" status to ${confirmDialog.newStatus}?`
                }
                confirmText={confirmDialog.type === 'delete' ? 'Delete' : 'Confirm'}
                cancelText="Cancel"
                variant={confirmDialog.type === 'delete' ? 'destructive' : 'default'}
                onConfirm={confirmDialog.type === 'delete' ? handleDelete : handleStatusChange}
                isLoading={isDeleting === confirmDialog.customerId}
            />
        </div>
    );
}
