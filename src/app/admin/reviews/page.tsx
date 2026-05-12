import React from 'react';
import { getReviews } from '@/actions/review';
import { ReviewClient } from '@/components/admin/ReviewClient';

export default async function AdminReviewsPage() {
    const res = await getReviews();
    const reviews = res?.success ? res.data : [];
    return <ReviewClient reviews={reviews} />;
}
