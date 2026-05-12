'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Activity } from 'lucide-react';
import { getCustomerAnalytics, getCustomerGrowthData } from '@/actions/customer';

interface CustomerAnalyticsProps {
    analytics: any;
    growthData: any;
}

export function CustomerAnalyticsDashboard({ analytics, growthData }: CustomerAnalyticsProps) {
    if (!analytics.success) {
        return <div className="p-6 text-red-600">Failed to load analytics</div>;
    }

    const data = analytics.data;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Customer Analytics</h2>
                <p className="text-muted-foreground mt-1">
                    Track customer metrics and growth trends.
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Total Customers</span>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground mt-1">All registered customers</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>New Customers</span>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{data.newCustomers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Active Customers</span>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{data.activeCustomers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Current status</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>Avg. Order Value</span>
                            <span className="text-xl">$</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.averageOrderValue?.toFixed(2) || '0.00'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Average per customer</p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Spenders */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Top Spenders</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Customers with highest total spent</p>
                </CardHeader>
                <CardContent>
                    {data.topSpenders && data.topSpenders.length > 0 ? (
                        <div className="space-y-3">
                            {data.topSpenders.map((customer: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{customer.name}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">${customer.totalSpent?.toFixed(2) || '0.00'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">No data available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
