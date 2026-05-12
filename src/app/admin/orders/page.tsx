import React from 'react';
import { getOrders } from '@/actions/order';
import { OrderClient } from '@/components/admin/OrderClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const res = await getOrders();
  const orders = res?.success ? res.data : [];

  return <OrderClient orders={orders} />;
}
