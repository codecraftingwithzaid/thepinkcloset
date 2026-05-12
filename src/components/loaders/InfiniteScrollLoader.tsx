'use client';

import { motion } from 'framer-motion';

interface InfiniteScrollLoaderProps {
    isLoading: boolean;
    hasMore: boolean;
}

/**
 * Infinite scroll loader
 * Elegant loading indicator for pagination
 */
export function InfiniteScrollLoader({
    isLoading,
    hasMore,
}: InfiniteScrollLoaderProps) {
    if (!isLoading && !hasMore) return null;

    return (
        <motion.div
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    No more items to load
                </p>
            )}
        </motion.div>
    );
}
