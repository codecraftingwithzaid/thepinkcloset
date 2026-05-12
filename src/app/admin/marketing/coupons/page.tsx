import React from 'react';
import { getCoupons } from '@/actions/coupon';
import { CouponClient } from '@/components/admin/marketing/CouponClient';

export default async function AdminCouponsPage() {
  const res = await getCoupons();
  const coupons = res?.success ? res.data : [];

  return <CouponClient coupons={coupons} />;
}
