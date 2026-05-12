import React from 'react';
import { getBlogs } from '@/actions/blog';
import { BlogClient } from '@/components/admin/BlogClient';

export default async function AdminBlogsPage() {
  const res = await getBlogs();
  const blogs = res?.success ? res.data : [];

  return <BlogClient blogs={blogs} />;
}
