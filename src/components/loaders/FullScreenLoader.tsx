'use client';

import { motion } from 'framer-motion';

interface FullScreenLoaderProps {
    isVisible?: boolean;
    message?: string;
    blur?: boolean;
}

/**
 * Full-screen overlay loader with elegant animation
 * Premium loading experience for page transitions
 */
export function FullScreenLoader({
    isVisible = true,
    message = 'Loading...',
    blur = true,
}: FullScreenLoaderProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-neutral-950/80 ${blur ? 'backdrop-blur-md' : ''
                }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Animated gradient logo/icon circle */}
            <motion.div
                className="relative mb-6 h-16 w-16"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 opacity-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <div className="absolute inset-0 rounded-full bg-white dark:bg-neutral-950" />
                </motion.div>

                {/* Inner spinner */}
                <motion.div
                    className="absolute inset-4 rounded-full border-2 border-transparent border-t-rose-400 border-r-pink-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
            </motion.div>

            {/* Loading text */}
            {message && (
                <motion.p
                    className="text-center text-neutral-600 dark:text-neutral-300"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {message}
                </motion.p>
            )}

            {/* Animated dots */}
            <motion.div className="mt-4 flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
