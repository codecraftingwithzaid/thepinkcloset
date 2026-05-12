'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/actions/order';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrderClient({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res?.success) {
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      toast.error('Failed to update status', { description: res?.error });
    }
    setIsUpdating(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Shipped': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-1">Manage and track customer orders.</p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Recent Orders</CardTitle>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by Order ID or Customer..." 
                className="pl-9 bg-muted/50 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No orders found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                We couldn't find any orders matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredOrders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-primary">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{order.user?.name || 'Guest User'}</span>
                          <span className="text-xs text-muted-foreground">{order.user?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: true})}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">${order.totalPrice?.toFixed(2) ?? '0.00'}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={`inline-flex h-8 items-center justify-center rounded-full border px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${getStatusColor(order.status)} ${isUpdating === order._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {isUpdating === order._id ? 'Updating...' : order.status}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STATUS_OPTIONS.map(status => (
                              <DropdownMenuItem 
                                key={status}
                                onClick={() => handleStatusChange(order._id, status)}
                                className={status === order.status ? 'bg-muted font-medium' : ''}
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
