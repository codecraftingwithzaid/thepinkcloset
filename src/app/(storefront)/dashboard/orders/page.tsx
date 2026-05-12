import React from 'react';
import { Button } from '@/components/ui/button';

export default function CustomerOrdersPage() {
  const orders = [
    { id: 'LX-10492', date: 'May 10, 2026', total: 345.50, status: 'Delivered', items: 2 },
    { id: 'LX-09384', date: 'April 22, 2026', total: 189.99, status: 'Delivered', items: 1 },
    { id: 'LX-08112', date: 'March 05, 2026', total: 520.00, status: 'Returned', items: 3 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-600';
      case 'Returned': return 'bg-gray-500/10 text-gray-600';
      case 'Processing': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-2">My Orders</h2>
        <p className="text-muted-foreground">View your order history and track recent shipments.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-border rounded-xl p-6 bg-background">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-border pb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-bold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Placed</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">{order.items} {order.items === 1 ? 'item' : 'items'} in this order</p>
               <div className="flex gap-3">
                 <Button variant="outline" size="sm" className="rounded-full">View Details</Button>
                 {order.status === 'Delivered' && (
                   <Button variant="outline" size="sm" className="rounded-full">Request Return</Button>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
