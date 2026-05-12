'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PageTransitionContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    setMessage: (message: string) => void;
    message: string;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(
    undefined
);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('Loading...');

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const value: PageTransitionContextType = {
        isLoading,
        startLoading,
        stopLoading,
        setMessage,
        message,
    };

    return (
        <PageTransitionContext.Provider value={value}>
            {children}
        </PageTransitionContext.Provider>
    );
}

export function usePageTransition() {
    const context = useContext(PageTransitionContext);
    if (!context) {
        throw new Error(
            'usePageTransition must be used within PageTransitionProvider'
        );
    }
    return context;
}
