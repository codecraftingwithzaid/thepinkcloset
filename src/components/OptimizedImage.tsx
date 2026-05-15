'use client';

import React, { ImgHTMLAttributes, useState, useCallback } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    alt: string;
    placeholder?: string;
    width?: number;
    height?: number;
    quality?: number; // 1-100
    format?: 'webp' | 'jpg' | 'png';
}

/**
 * Optimized image component that uses Supabase Storage transformations
 * Automatically handles responsive images and fallbacks
 */
export function OptimizedImage({
    src,
    alt,
    placeholder = 'https://via.placeholder.com/600x800?text=Loading...',
    width,
    height,
    quality = 85,
    format = 'webp',
    className,
    onError,
    ...props
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    // Generate Supabase optimized URL
    const getOptimizedUrl = useCallback((imageUrl: string) => {
        if (!imageUrl || !imageUrl.includes('supabase.co')) {
            return imageUrl;
        }

        // Extract the original URL
        let params = '?';
        if (width) params += `width=${width}&`;
        if (height) params += `height=${height}&`;
        params += `quality=${quality}&format=${format}`;

        return `${imageUrl}${params}`;
    }, [width, height, quality, format]);

    const handleError = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            setImageSrc(placeholder);
            onError?.(e as any);
        },
        [placeholder, onError]
    );

    const handleLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const optimizedUrl = getOptimizedUrl(imageSrc);

    return (
        <img
            src={optimizedUrl}
            alt={alt}
            className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity ${className || ''}`}
            onError={handleError}
            onLoad={handleLoad}
            {...props}
        />
    );
}

/**
 * Responsive picture component with WebP support
 */
export function ResponsiveImage({
    src,
    alt,
    placeholder = 'https://via.placeholder.com/600x800?text=Loading...',
    mobileWidth = 400,
    desktopWidth = 800,
    quality = 85,
    className,
}: {
    src: string;
    alt: string;
    placeholder?: string;
    mobileWidth?: number;
    desktopWidth?: number;
    quality?: number;
    className?: string;
}) {
    const [imageSrc, setImageSrc] = useState(src);

    if (!imageSrc?.includes('supabase.co')) {
        return <img src={imageSrc || placeholder} alt={alt} className={className} />;
    }

    return (
        <picture>
            <source
                srcSet={`${imageSrc}?width=${mobileWidth}&quality=${quality}&format=webp`}
                media="(max-width: 640px)"
                type="image/webp"
            />
            <source
                srcSet={`${imageSrc}?width=${desktopWidth}&quality=${quality}&format=webp`}
                media="(min-width: 641px)"
                type="image/webp"
            />
            <source srcSet={`${imageSrc}?width=${mobileWidth}&quality=${quality}`} media="(max-width: 640px)" />
            <source srcSet={`${imageSrc}?width=${desktopWidth}&quality=${quality}`} media="(min-width: 641px)" />
            <img
                src={imageSrc || placeholder}
                alt={alt}
                className={className}
                onError={(e) => (e.currentTarget.src = placeholder)}
            />
        </picture>
    );
}

/**
 * Avatar component with size presets
 */
export function OptimizedAvatar({
    src,
    alt,
    size = 'md',
    className,
}: {
    src?: string;
    alt: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}) {
    const sizeMap = {
        xs: 32,
        sm: 40,
        md: 48,
        lg: 64,
        xl: 96,
    };

    const dimension = sizeMap[size];
    const sizeClass = `w-${dimension} h-${dimension}`;

    if (!src) {
        return (
            <div className={`${sizeClass} rounded-full bg-gray-200 flex items-center justify-center ${className || ''}`}>
                <span className="text-gray-500 text-sm">No Image</span>
            </div>
        );
    }

    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={dimension}
            height={dimension}
            className={`${sizeClass} rounded-full object-cover ${className || ''}`}
        />
    );
}
