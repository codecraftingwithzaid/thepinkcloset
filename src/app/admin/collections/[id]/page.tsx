import React from 'react';
import { notFound } from 'next/navigation';
import { getCollectionById } from '@/actions/collection';
import { CollectionDetailClient } from '@/components/admin/CollectionDetailClient';

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getCollectionById(id);

    if (!result.success) {
        notFound();
    }

    return <CollectionDetailClient collection={result.data} />;
}
