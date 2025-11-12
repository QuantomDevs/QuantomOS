import { useState, useCallback, useRef } from 'react';
import { ToastManager } from '../components/toast/ToastManager';

interface OptimisticUpdateOptions<T> {
    updateFn: (data: T) => Promise<void>;
    rollbackFn?: (data: T) => void;
    successMessage?: string;
    errorMessage?: string;
    silent?: boolean; // Don't show success toasts
}

/**
 * Custom hook for optimistic UI updates
 *
 * This hook implements the optimistic update pattern:
 * 1. Update UI immediately
 * 2. Send request to backend
 * 3. Rollback on error
 *
 * @param initialState Initial state value
 * @param options Configuration options for the optimistic update
 * @returns Object containing state, setState, update function, and loading status
 */
export function useOptimisticUpdate<T>(
    initialState: T,
    options: OptimisticUpdateOptions<T>
) {
    const [state, setState] = useState<T>(initialState);
    const [isUpdating, setIsUpdating] = useState(false);
    const previousStateRef = useRef<T>(initialState);

    const update = useCallback(
        async (newState: T) => {
            // Save current state for potential rollback
            previousStateRef.current = state;

            // Step 1: Update UI optimistically
            setState(newState);
            if (options.successMessage && !options.silent) {
                ToastManager.success(options.successMessage);
            }

            setIsUpdating(true);

            // Step 2: Send to backend
            try {
                await options.updateFn(newState);
            } catch (err) {
                // Step 3: Rollback on error
                setState(previousStateRef.current);
                if (options.rollbackFn) {
                    options.rollbackFn(previousStateRef.current);
                }

                const errorMsg = options.errorMessage || 'Operation failed';
                ToastManager.error(errorMsg);

                // Re-throw so caller can handle if needed
                throw err;
            } finally {
                setIsUpdating(false);
            }
        },
        [state, options]
    );

    // Sync with external state changes
    const syncState = useCallback((newState: T) => {
        setState(newState);
        previousStateRef.current = newState;
    }, []);

    return { state, setState, update, isUpdating, syncState };
}

/**
 * Debounce utility function
 * Returns a debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Hook for tracking pending operations to prevent race conditions
 */
export function usePendingOperations() {
    const pendingOperations = useRef<Set<string>>(new Set());

    const isPending = useCallback((id: string): boolean => {
        return pendingOperations.current.has(id);
    }, []);

    const addPending = useCallback((id: string) => {
        pendingOperations.current.add(id);
    }, []);

    const removePending = useCallback((id: string) => {
        pendingOperations.current.delete(id);
    }, []);

    const withPendingCheck = useCallback(
        async <T,>(id: string, operation: () => Promise<T>): Promise<T | null> => {
            // Prevent duplicate operations
            if (isPending(id)) {
                console.log('Operation already in progress:', id);
                return null;
            }

            addPending(id);

            try {
                const result = await operation();
                return result;
            } finally {
                removePending(id);
            }
        },
        [isPending, addPending, removePending]
    );

    return { isPending, addPending, removePending, withPendingCheck };
}
