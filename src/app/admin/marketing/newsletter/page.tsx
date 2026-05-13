import React from 'react';
import { getSubscribers, getSubscriberStats } from '@/actions/subscriber';

import { NewsletterClient } from '@/components/admin/marketing/NewsletterClient';

export default async function AdminNewsletterPage() {
    const [listResult, statsResult] = await Promise.all([getSubscribers(), getSubscriberStats()]);
    const subscribers = listResult?.ok ? listResult.subscribers : [];
    const stats = statsResult?.ok ? statsResult.stats : { total: 0, subscribed: 0, unsubscribed: 0, bounced: 0 };

    return <NewsletterClient subscribers={subscribers} stats={stats} />;
}
