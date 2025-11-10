import { useState, useCallback } from 'react';
import { ToastManager } from '../components/toast/ToastManager';

export function useApi<T, P extends any[]>(
    apiFunc: (...args: P) => Promise<T>
) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: P): Promise<T | undefined> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await apiFunc(...args);
            setData(result);
            return result;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'An unexpected error occurred';
            setError(errorMessage);
            ToastManager.error(errorMessage);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [apiFunc]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return { data, isLoading, error, execute, reset };
}
