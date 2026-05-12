import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Heart, MapPin } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-2">Account Overview</h2>
        <p className="text-muted-foreground">Manage your orders, profile, and preferences from here.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-muted/30 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <Heart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold font-heading mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg flex justify-between items-center bg-background">
             <div>
               <p className="font-medium">Order #LX-10492</p>
               <p className="text-sm text-muted-foreground">Placed on May 10, 2026</p>
             </div>
             <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Delivered</span>
          </div>
          <div className="p-4 border border-border rounded-lg flex justify-between items-center bg-background">
             <div>
               <p className="font-medium">Order #LX-09384</p>
               <p className="text-sm text-muted-foreground">Placed on April 22, 2026</p>
             </div>
             <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
