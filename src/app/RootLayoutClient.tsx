'use client';

import { PageTransitionProvider, FullScreenLoader, usePageTransition } from '@/components/loaders';
import { ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PageTransitionOverlay() {
    const { isLoading } = usePageTransition();
    return <FullScreenLoader isVisible={isLoading} message="Loading..." />;
}

export function RootLayoutClient({ children }: { children: ReactNode }) {
    return (
        <PageTransitionProvider>
            <PageTransitionOverlay />
            {children}
        </PageTransitionProvider>
    );
}
