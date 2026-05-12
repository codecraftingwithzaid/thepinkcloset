import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, ShoppingBag, TrendingUp, CreditCard, Activity } from 'lucide-react';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import connectToDatabase from '@/lib/db';
// Use centralized registry to ensure all models are registered before queries
import { Order, User, Product } from '@/lib/models';

export const revalidate = 0; // Dynamic route

async function getStats() {
  try {
    await connectToDatabase();
    
    const [totalOrders, totalUsers, totalProducts] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments()
    ]);

    // Aggregate total revenue — field is 'totalPrice' per Order schema
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    return { totalOrders, totalUsers, totalProducts, totalRevenue };
  } catch (error) {
    console.error('[getStats]', error);
    return { totalOrders: 0, totalUsers: 0, totalProducts: 0, totalRevenue: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Welcome back. Here is what's happening with your store today.</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">+{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" /> +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">+{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" /> +4.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Live in store</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading">Revenue Analytics</CardTitle>
            <CardDescription>Monthly revenue overview for the current year</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardCharts />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading">Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Customer {i}</p>
                    <p className="text-sm text-muted-foreground">customer{i}@email.com</p>
                  </div>
                  <div className="ml-auto font-medium">+$299.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
