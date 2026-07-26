import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 848;

/**
 * Detects whether the viewport is below the mobile breakpoint (768px).
 * Uses `matchMedia` for efficient, event-driven detection instead of resize polling.
 */
export const useIsMobile = (): boolean => {
    // Initialize state synchronously using a lazy initializer
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
        }
        return false;
    });

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    return isMobile;
};
