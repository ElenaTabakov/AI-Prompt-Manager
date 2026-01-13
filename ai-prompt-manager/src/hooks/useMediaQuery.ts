import { useSyncExternalStore } from 'react';

/**
 * Hook that tracks a CSS media query
 * Uses useSyncExternalStore for proper React 18 compatibility
 * 
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns boolean - Whether the media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false; // Default for SSR
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

// Pre-defined breakpoint hooks for convenience
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
