'use client';

import { SkeletonShimmer } from './SkeletonShimmer';

/**
 * Product card skeleton loader
 * Premium loading state for product grids
 */
export function ProductSkeleton() {
    return (
        <div className="space-y-3">
            {/* Product image */}
            <div className="aspect-square overflow-hidden rounded-lg">
                <SkeletonShimmer width="100%" height="100%" borderRadius="rounded-lg" />
            </div>

            {/* Product name */}
            <SkeletonShimmer width="85%" height="1rem" borderRadius="rounded-md" />

            {/* Product category */}
            <SkeletonShimmer width="60%" height="0.875rem" borderRadius="rounded-md" />

            {/* Price row */}
            <div className="flex gap-2">
                <SkeletonShimmer width="40%" height="1.25rem" borderRadius="rounded-md" />
                <SkeletonShimmer width="35%" height="1.25rem" borderRadius="rounded-md" />
            </div>

            {/* Rating and button */}
            <div className="flex items-center gap-2 pt-2">
                <SkeletonShimmer width="25%" height="1rem" borderRadius="rounded-md" />
                <SkeletonShimmer width="60%" height="2.5rem" borderRadius="rounded-md" />
            </div>
        </div>
    );
}
