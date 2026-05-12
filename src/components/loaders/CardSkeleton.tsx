'use client';

import { SkeletonShimmer } from './SkeletonShimmer';

interface CardSkeletonProps {
    lines?: number;
    showImage?: boolean;
    imageHeight?: string;
}

/**
 * Generic card skeleton loader
 * Used for loading card-based content
 */
export function CardSkeleton({
    lines = 3,
    showImage = false,
    imageHeight = 'h-40',
}: CardSkeletonProps) {
    return (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
            {showImage && (
                <SkeletonShimmer width="100%" height="160px" borderRadius="rounded-lg" />
            )}
            <div className="space-y-3">
                <SkeletonShimmer width="70%" height="1.25rem" />
                {Array.from({ length: lines }).map((_, i) => (
                    <SkeletonShimmer
                        key={i}
                        width={i === lines - 1 ? '60%' : '100%'}
                        height="0.875rem"
                    />
                ))}
            </div>
        </div>
    );
}
