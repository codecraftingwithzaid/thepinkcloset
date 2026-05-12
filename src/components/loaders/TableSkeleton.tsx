'use client';

import { SkeletonShimmer } from './SkeletonShimmer';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

/**
 * Table skeleton loader
 * Enterprise-grade loading for data tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            {/* Header */}
            <div className="grid gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-700" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <SkeletonShimmer key={`header-${i}`} width="100%" height="1rem" />
                ))}
            </div>

            {/* Rows */}
            <div className="space-y-4">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <div
                        key={`row-${rowIdx}`}
                        className="grid gap-4 border-b border-neutral-100 pb-4 last:border-0 dark:border-neutral-800"
                        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                    >
                        {Array.from({ length: columns }).map((_, colIdx) => (
                            <SkeletonShimmer
                                key={`cell-${rowIdx}-${colIdx}`}
                                width="100%"
                                height="0.875rem"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
