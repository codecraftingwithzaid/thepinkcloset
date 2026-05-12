import React from 'react';
import { getNotifications } from '@/actions/notification';
import { NotificationClient } from '@/components/admin/marketing/NotificationClient';

export default async function AdminNotificationsPage() {
    const res = await getNotifications();
    const notifications = res?.success ? res.data : [];
    return <NotificationClient notifications={notifications} />;
}
