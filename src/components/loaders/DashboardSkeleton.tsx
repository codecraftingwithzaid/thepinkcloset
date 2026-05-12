'use client';

import { SkeletonShimmer } from './SkeletonShimmer';

interface DashboardSkeletonProps {
    showHeader?: boolean;
    cardCount?: number;
    showChart?: boolean;
}

/**
 * Dashboard skeleton loader
 * SaaS-quality loading for analytics pages
 */
export function DashboardSkeleton({
    showHeader = true,
    cardCount = 4,
    showChart = true,
}: DashboardSkeletonProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            {showHeader && (
                <div className="space-y-3">
                    <SkeletonShimmer width="30%" height="1.75rem" borderRadius="rounded-lg" />
                    <SkeletonShimmer width="50%" height="1rem" borderRadius="rounded-lg" />
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: cardCount }).map((_, i) => (
                    <div
                        key={i}
                        className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <SkeletonShimmer width="60%" height="0.875rem" />
                        <SkeletonShimmer width="100%" height="1.75rem" />
                        <SkeletonShimmer width="40%" height="0.75rem" />
                    </div>
                ))}
            </div>

            {/* Chart */}
            {showChart && (
                <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900">
                    <SkeletonShimmer width="25%" height="1.25rem" />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-end gap-2">
                                <SkeletonShimmer width="5%" height={`${100 + i * 40}px`} />
                                <SkeletonShimmer width="5%" height={`${80 + i * 35}px`} />
                                <SkeletonShimmer width="5%" height={`${120 + i * 30}px`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Table preview */}
            <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <SkeletonShimmer width="25%" height="1.25rem" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonShimmer key={i} width="100%" height="2rem" />
                    ))}
                </div>
            </div>
        </div>
    );
}
