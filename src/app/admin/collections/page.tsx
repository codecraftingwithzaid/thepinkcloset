import React from 'react';
import { getCollections } from '@/actions/collection';
import { CollectionClient } from '@/components/admin/CollectionClient';

export const revalidate = 0;

export default async function AdminCollectionsPage() {
  const res = await getCollections();
  const collections = res?.success ? res.data : [];

  return <CollectionClient collections={collections} />;
}
