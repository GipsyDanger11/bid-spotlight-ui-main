import { useEffect, useRef } from 'react';

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inFlightRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        await fetchFn();
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        inFlightRef.current = false;
      }
    };

    // Initial fetch
    poll();

    // Set up interval
    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchFn, interval, enabled]);

  return {
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
}
