'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    ShoppingCart,
    Clock,
    Edit2,
    Plus,
    Trash2,
    Check,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { updateCustomer, removeCustomerAddress, addCustomerAddress, updateCustomerStatus, updateCustomerRole } from '@/actions/customer';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CustomerDetailClientProps {
    customer: any;
}

export function CustomerDetailClient({ customer: initialCustomer }: CustomerDetailClientProps) {
    const router = useRouter();
    const [customer, setCustomer] = useState(initialCustomer);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
    });
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false,
    });
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'delete' | 'address' | 'status' | 'role' | null;
        data: any;
    }>({
        open: false,
        type: null,
        data: null,
    });

    const handleSaveEdit = async () => {
        const res = await updateCustomer(customer._id, editData);
        if (res?.success) {
            toast.success('Customer updated successfully');
            setCustomer({ ...customer, ...editData });
            setIsEditing(false);
        } else {
            toast.error('Failed to update customer', { description: res?.error });
        }
    };

    const handleAddAddress = async () => {
        const res = await addCustomerAddress(customer._id, newAddress);
        if (res?.success) {
            toast.success('Address added successfully');
            setCustomer({
                ...customer,
                addresses: [...(customer.addresses || []), { id: Date.now().toString(), ...newAddress }],
            });
            setNewAddress({
                fullName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
                isDefault: false,
            });
            setIsAddingAddress(false);
        } else {
            toast.error('Failed to add address', { description: res?.error });
        }
    };

    const handleRemoveAddress = async (addressId: string) => {
        const res = await removeCustomerAddress(customer._id, addressId);
        if (res?.success) {
            toast.success('Address removed successfully');
            setCustomer({
                ...customer,
                addresses: customer.addresses.filter((a: any) => a.id !== addressId),
            });
        } else {
            toast.error('Failed to remove address', { description: res?.error });
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        const res = await updateCustomerStatus(customer._id, newStatus as 'active' | 'blocked' | 'suspended');
        if (res?.success) {
            toast.success(`Customer status changed to ${newStatus}`);
            setCustomer({ ...customer, status: newStatus });
            router.refresh();
        } else {
            toast.error('Failed to update customer status', { description: res?.error });
        }
    };

    const handleRoleChange = async (newRole: string) => {
        const res = await updateCustomerRole(customer._id, newRole as 'customer' | 'admin' | 'staff');
        if (res?.success) {
            toast.success(`Customer role changed to ${newRole}`);
            setCustomer({ ...customer, role: newRole });
            router.refresh();
        } else {
            toast.error('Failed to update customer role', { description: res?.error });
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
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">{customer.name}</h1>
                    <p className="text-muted-foreground">Customer details and information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                            <div>
                                <CardTitle>Profile Information</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Basic customer details</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={editData.name}
                                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            value={editData.email}
                                            onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input
                                            value={editData.phone}
                                            onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveEdit} size="sm">
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditData({
                                                    name: customer.name,
                                                    email: customer.email,
                                                    phone: customer.phone,
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        {customer.image ? (
                                            <img
                                                src={customer.image}
                                                alt={customer.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="font-semibold text-primary">
                                                    {customer.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">{customer.name}</p>
                                            <p className="text-sm text-muted-foreground">{customer._id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                                                <p className="font-medium">{customer.email}</p>
                                            </div>
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-start gap-3">
                                                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                                                    <p className="font-medium">{customer.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Joined</p>
                                                <p className="font-medium">
                                                    {new Date(customer.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {customer.lastLogin && (
                                            <div className="flex items-start gap-3">
                                                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Login</p>
                                                    <p className="font-medium">
                                                        {new Date(customer.lastLogin).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-start justify-between pb-4">
                            <div>
                                <CardTitle>Addresses</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Saved addresses</p>
                            </div>
                            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Address
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Address</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <Input
                                            placeholder="Full Name"
                                            value={newAddress.fullName}
                                            onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Phone"
                                            value={newAddress.phone}
                                            onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Address"
                                            value={newAddress.address}
                                            onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                            />
                                            <Input
                                                placeholder="State"
                                                value={newAddress.state}
                                                onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Postal Code"
                                                value={newAddress.postalCode}
                                                onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Country"
                                                value={newAddress.country}
                                                onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newAddress.isDefault}
                                                onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                            />
                                            <span className="text-sm">Set as default</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <Button onClick={handleAddAddress} className="flex-1">
                                                Add Address
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsAddingAddress(false)}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {customer.addresses && customer.addresses.length > 0 ? (
                                <div className="space-y-3">
                                    {customer.addresses.map((address: any) => (
                                        <div
                                            key={address.id}
                                            className="p-3 rounded-lg border border-border/50 flex justify-between items-start"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{address.fullName}</p>
                                                    {address.isDefault && (
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {address.address}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {address.city}, {address.state} {address.postalCode}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{address.country}</p>
                                                <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveAddress(address.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No addresses saved</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ShoppingCart className="h-4 w-4" />
                                    Total Orders
                                </div>
                                <span className="font-semibold text-lg">{customer.totalOrders}</span>
                            </div>
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />
                                    Total Spent
                                </div>
                                <span className="font-semibold text-lg">${customer.totalSpent?.toFixed(2) || '0.00'}</span>
                            </div>
                            {customer.rewardPoints && (
                                <div className="flex items-center justify-between p-2">
                                    <div className="text-sm text-muted-foreground">Reward Points</div>
                                    <span className="font-semibold text-lg">{customer.rewardPoints}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                <Select value={customer.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="blocked">Blocked</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Role</label>
                                <Select value={customer.role} onValueChange={handleRoleChange}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-2">
                                <span
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(
                                        customer.status
                                    )}`}
                                >
                                    {customer.status}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Activity Timeline */}
            {customer.loginActivity && customer.loginActivity.length > 0 && (
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {customer.loginActivity.slice(0, 5).map((activity: any, index: number) => (
                                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="font-medium text-sm">Login</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
