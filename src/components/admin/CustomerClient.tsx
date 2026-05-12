'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Ban, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { toggleCustomerBlockStatus } from '@/actions/customer';

export function CustomerClient({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id);
    const newStatus = !currentStatus;
    const res = await toggleCustomerBlockStatus(id, newStatus);
    if (res?.success) {
      toast.success(res.message);
      // In a real app we'd want to optimistic update or router.refresh here if the parent passes it down,
      // but Server Actions with revalidatePath will handle the refresh automatically.
    } else {
      toast.error('Failed to update status', { description: res?.error });
    }
    setIsUpdating(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground mt-1">Manage your customer accounts and activity.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>All Customers</CardTitle>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-9 bg-muted/50 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No customers found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                No customer accounts match your search criteria.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Joined On</th>
                    <th className="px-6 py-4">Orders</th>
                    <th className="px-6 py-4">Total Spent</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCustomers.map((customer: any) => (
                    <tr key={customer._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {customer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{customer.name}</span>
                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">{customer.orderCount || 0}</td>
                      <td className="px-6 py-4 font-medium text-primary">
                        ${(customer.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {customer.isBlocked ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-600">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-green-500/10 text-green-600">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`h-8 w-8 ${customer.isBlocked ? 'text-green-600 hover:text-green-700 hover:bg-green-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-500/10'}`}
                          onClick={() => handleToggleBlock(customer._id, customer.isBlocked)}
                          disabled={isUpdating === customer._id}
                        >
                          {isUpdating === customer._id ? (
                            <span className="animate-spin text-xs">...</span>
                          ) : customer.isBlocked ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
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
