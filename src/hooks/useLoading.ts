import { useState, useEffect, useCallback, useRef } from 'react';

export const useLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return { isLoading, startLoading, stopLoading, setIsLoading };
};

export const useSimulatedLoading = (duration = 2000, initialLoading = true) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, initialLoading]);

  return { isLoading, setIsLoading };
};

// Hook for page transitions with loading states
export const usePageLoading = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPageLoading = useCallback(() => {
    setIsPageLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsPageLoading(false);
      timerRef.current = null;
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isPageLoading, startPageLoading, setIsPageLoading };
};
