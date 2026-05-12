'use client';

import { motion } from 'framer-motion';

interface ButtonLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'dots' | 'spinner' | 'bar';
    color?: 'rose' | 'pink' | 'white';
}

/**
 * Loading state component for buttons
 * Shows elegant spinner inside buttons
 */
export function ButtonLoader({
    size = 'md',
    variant = 'spinner',
    color = 'white',
}: ButtonLoaderProps) {
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    const colorClasses = {
        rose: 'text-rose-400',
        pink: 'text-pink-400',
        white: 'text-white',
    };

    if (variant === 'dots') {
        return (
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`rounded-full bg-current ${sizeClasses[size]}`}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'bar') {
        return (
            <motion.div
                className={`h-1 w-12 rounded-full bg-gradient-to-r from-current via-current/50 to-transparent`}
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            />
        );
    }

    // spinner variant
    return (
        <motion.svg
            className={`${sizeClasses[size]} ${colorClasses[color]}`}
            fill="none"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </motion.svg>
    );
}
