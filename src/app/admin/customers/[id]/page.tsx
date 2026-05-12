import React from 'react';
import { getCustomerById } from '@/actions/customer';
import { CustomerDetailClient } from '@/components/admin/CustomerDetailClient';
import { notFound } from 'next/navigation';

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getCustomerById(id);

    if (!result.success) {
        notFound();
    }

    return <CustomerDetailClient customer={result.data} />;
}
