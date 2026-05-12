import React from 'react';
import { getCustomers } from '@/actions/customer';
import { CustomerListClient } from '@/components/admin/CustomerListClient';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const status = params.status || '';

  const result = await getCustomers(page, 10, search, status);

  if (!result.success) {
    return <div className="p-6 text-red-600">Failed to load customers</div>;
  }

  return (
    <CustomerListClient
      customers={result.data || []}
      pagination={result.pagination || { total: 0, page: 1, limit: 10, pages: 0 }}
    />
  );
}
