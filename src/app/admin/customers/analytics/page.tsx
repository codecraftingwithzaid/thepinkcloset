import React from 'react';
import { getCustomerAnalytics, getCustomerGrowthData } from '@/actions/customer';
import { CustomerAnalyticsDashboard } from '@/components/admin/CustomerAnalyticsDashboard';

export default async function CustomerAnalyticsPage() {
    const [analyticsResult, growthResult] = await Promise.all([
        getCustomerAnalytics(),
        getCustomerGrowthData(),
    ]);

    return (
        <CustomerAnalyticsDashboard
            analytics={analyticsResult}
            growthData={growthResult}
        />
    );
}
