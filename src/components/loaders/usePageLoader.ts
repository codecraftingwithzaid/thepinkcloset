'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface UsePageLoaderReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

/**
 * Hook for managing page transition loading state
 * Automatically shows loader on route changes
 */
export function usePageLoader(): UsePageLoaderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Stop loading when pathname or searchParams change
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return { isLoading, startLoading, stopLoading };
}
