'use client';

import { motion } from 'framer-motion';

interface ImagePlaceholderProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    showShimmer?: boolean;
}

/**
 * Image loading placeholder
 * Beautiful fallback while images load
 */
export function ImagePlaceholder({
    width = '100%',
    height = '300px',
    borderRadius = 'rounded-lg',
    showShimmer = true,
}: ImagePlaceholderProps) {
    return (
        <motion.div
            className={`relative overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 ${borderRadius}`}
            style={{ width, height }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Icon */}
            <div className="flex h-full w-full items-center justify-center">
                <motion.svg
                    className="h-12 w-12 text-neutral-300 dark:text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-12-6.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m6-6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"
                    />
                </motion.svg>
            </div>

            {/* Shimmer effect */}
            {showShimmer && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}
        </motion.div>
    );
}
