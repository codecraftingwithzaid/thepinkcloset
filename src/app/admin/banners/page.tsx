import React from 'react';
import { getBanners } from '@/actions/banner';
import { BannerClient } from '@/components/admin/BannerClient';

export const revalidate = 0;

export default async function AdminBannersPage() {
  const res = await getBanners();
  const banners = res?.success ? res.data : [];

  return <BannerClient banners={banners} />;
}
