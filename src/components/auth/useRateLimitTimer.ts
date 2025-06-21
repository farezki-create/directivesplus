
import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage a rate limit timer (expiry, current time, active state).
 */
export function useRateLimitTimer(initialExpiry: Date | null = null) {
  const [rateLimitExpiry, setRateLimitExpiry] = useState<Date | null>(initialExpiry);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rateLimitExpiry && currentTime >= rateLimitExpiry) {
      setRateLimitExpiry(null);
    }
  }, [currentTime, rateLimitExpiry]);

  const start = useCallback((durationMs: number) => {
    setRateLimitExpiry(new Date(Date.now() + durationMs));
  }, []);

  const reset = useCallback(() => setRateLimitExpiry(null), []);

  const isActive = !!(rateLimitExpiry && currentTime < rateLimitExpiry);

  const remainingMs = isActive ? rateLimitExpiry!.getTime() - currentTime.getTime() : 0;

  return {
    rateLimitExpiry,
    currentTime,
    isActive,
    remainingMs,
    setRateLimitExpiry,
    start,
    reset,
  };
}
