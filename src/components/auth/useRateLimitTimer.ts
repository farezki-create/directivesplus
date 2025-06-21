
import { useState, useCallback, useEffect } from 'react';

export const useRateLimitTimer = () => {
  const [rateLimitExpiry, setRateLimitExpiry] = useState<Date | null>(null);

  const isActive = rateLimitExpiry ? new Date() < rateLimitExpiry : false;

  const start = useCallback((durationMs: number) => {
    const expiryDate = new Date(Date.now() + durationMs);
    setRateLimitExpiry(expiryDate);
  }, []);

  const reset = useCallback(() => {
    setRateLimitExpiry(null);
  }, []);

  useEffect(() => {
    if (!rateLimitExpiry) return;

    const timer = setInterval(() => {
      if (new Date() >= rateLimitExpiry) {
        setRateLimitExpiry(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitExpiry]);

  return {
    rateLimitExpiry,
    isActive,
    start,
    reset,
  };
};
