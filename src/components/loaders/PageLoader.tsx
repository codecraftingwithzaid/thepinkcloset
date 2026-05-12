'use client';

import { motion } from 'framer-motion';

interface PageLoaderProps {
    variant?: 'minimal' | 'standard' | 'premium';
    showText?: boolean;
}

/**
 * Page transition loader component
 * Elegant loading state for route changes
 */
export function PageLoader({
    variant = 'premium',
    showText = true,
}: PageLoaderProps) {
    if (variant === 'minimal') {
        return (
            <motion.div
                className="flex h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="h-12 w-12 rounded-full border-2 border-neutral-200 border-t-rose-400 dark:border-neutral-700 dark:border-t-pink-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </motion.div>
        );
    }

    if (variant === 'standard') {
        return (
            <motion.div
                className="flex h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        className="h-14 w-14"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <svg
                            className="h-full w-full text-rose-400"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity="0.2"
                            />
                            <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </motion.div>
                    {showText && (
                        <motion.p
                            className="text-sm text-neutral-500 dark:text-neutral-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Loading...
                        </motion.p>
                    )}
                </div>
            </motion.div>
        );
    }

    // Premium variant
    return (
        <motion.div
            className="flex h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-neutral-50 to-purple-50 dark:from-rose-950/10 dark:via-neutral-950 dark:to-purple-950/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div className="flex flex-col items-center gap-8">
                {/* Main loader circle */}
                <motion.div className="relative h-20 w-20">
                    {/* Outer rotating ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-400 border-r-pink-400 border-b-purple-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Middle pulsing ring */}
                    <motion.div
                        className="absolute inset-3 rounded-full border-2 border-rose-200/50 dark:border-rose-900/50"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    {/* Inner dot */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400" />
                    </motion.div>
                </motion.div>

                {showText && (
                    <motion.div className="flex flex-col items-center gap-3">
                        <motion.p
                            className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-lg font-semibold text-transparent"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Loading your experience
                        </motion.p>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-rose-300 to-pink-300"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}
