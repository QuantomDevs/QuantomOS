import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    // Enable lazy loading when element is this distance from viewport
    triggerOnce?: boolean; // If true, only trigger once when element enters viewport
}

/**
 * Custom hook to detect when an element is visible in the viewport
 * using the Intersection Observer API
 *
 * @param ref - React ref to the element to observe
 * @param options - Intersection Observer options
 * @returns boolean indicating if the element is currently in viewport
 */
export const useIntersectionObserver = (
    ref: RefObject<Element>,
    options: UseIntersectionObserverOptions = {}
): boolean => {
    const {
        root = null,
        rootMargin = '200px', // Load widgets 200px before they enter viewport
        threshold = 0,
        triggerOnce = false
    } = options;

    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        const element = ref.current;

        // If no element or already triggered (when triggerOnce is true), don't observe
        if (!element || (triggerOnce && hasTriggered)) {
            return;
        }

        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers that don't support Intersection Observer
            // Always show the element
            setIsIntersecting(true);
            return;
        }

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                const isVisible = entry.isIntersecting;

                if (isVisible) {
                    setIsIntersecting(true);
                    if (triggerOnce) {
                        setHasTriggered(true);
                    }
                } else if (!triggerOnce) {
                    // Only set to false if we want to trigger multiple times
                    setIsIntersecting(false);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            root,
            rootMargin,
            threshold
        });

        observer.observe(element);

        // Cleanup
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [ref, root, rootMargin, threshold, triggerOnce, hasTriggered]);

    return isIntersecting;
};
