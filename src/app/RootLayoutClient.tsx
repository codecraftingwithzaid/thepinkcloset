'use client';

import { PageTransitionProvider, FullScreenLoader, usePageTransition } from '@/components/loaders';
import { useLoadingStore, stopGlobalLoading } from '@/store/useLoadingStore';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function PageTransitionOverlay() {
    const { isLoading } = usePageTransition();
    const loading = useLoadingStore((s) => s.counter > 0);
    return isLoading || loading ? <FullScreenLoader isVisible message="Loading..." /> : null;
}

export function RootLayoutClient({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-stop loader when route changes (handles stuck loaders from navigation handlers)
    useEffect(() => {
        stopGlobalLoading();
    }, [pathname]);

    return (
        <PageTransitionProvider>
            {mounted && <PageTransitionOverlay />}
            {children}
        </PageTransitionProvider>
    );
}
