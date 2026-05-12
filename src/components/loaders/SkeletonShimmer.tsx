'use client';

import { motion } from 'framer-motion';

interface SkeletonShimmerProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    animated?: boolean;
    borderRadius?: string;
}

/**
 * Elegant shimmer skeleton loader component
 * Used as base for all skeleton components
 */
export function SkeletonShimmer({
    width = '100%',
    height = '1rem',
    className = '',
    animated = true,
    borderRadius = 'rounded-md',
}: SkeletonShimmerProps) {
    return (
        <motion.div
            className={`relative overflow-hidden bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 ${borderRadius} ${className}`}
            style={{ width, height }}
            initial={{ opacity: 0.6 }}
            animate={animated ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
            transition={
                animated
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0 }
            }
        >
            {animated && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}
        </motion.div>
    );
}
