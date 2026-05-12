import React from 'react';
import { getNewsletter, getNewsletterStats } from '@/actions/newsletter';
import { NewsletterClient } from '@/components/admin/marketing/NewsletterClient';

export default async function AdminNewsletterPage() {
    const [listResult, statsResult] = await Promise.all([getNewsletter(), getNewsletterStats()]);
    const subscribers = listResult?.success ? listResult.data : [];
    const stats = statsResult?.success ? statsResult.data : { total: 0, active: 0, inactive: 0 };

    return <NewsletterClient subscribers={subscribers} stats={stats} />;
}
