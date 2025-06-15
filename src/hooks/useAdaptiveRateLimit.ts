
import { useState, useCallback } from 'react';
import { adaptiveRateLimiter } from '@/utils/security/adaptiveRateLimiter';
import { toast } from '@/hooks/use-toast';

interface RateLimitState {
  isBlocked: boolean;
  remainingRequests: number;
  resetTime: number;
  currentLimit: number;
}

export const useAdaptiveRateLimit = (endpoint: string) => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isBlocked: false,
    remainingRequests: 100,
    resetTime: 0,
    currentLimit: 100
  });

  const checkRateLimit = useCallback(async (identifier?: string): Promise<boolean> => {
    const userIdentifier = identifier || getUserIdentifier();
    const startTime = Date.now();

    try {
      const result = await adaptiveRateLimiter.checkLimit(endpoint, userIdentifier);
      
      setRateLimitState({
        isBlocked: !result.allowed,
        remainingRequests: result.remainingRequests,
        resetTime: result.resetTime,
        currentLimit: result.currentLimit
      });

      if (!result.allowed) {
        const resetIn = Math.ceil((result.resetTime - Date.now()) / 1000 / 60);
        toast({
          title: "Trop de requêtes",
          description: `Limite atteinte pour cet endpoint. Réessayez dans ${resetIn} minute(s).`,
          variant: "destructive",
          duration: 8000
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      adaptiveRateLimiter.recordError(endpoint);
      return true; // Fail open for better UX
    } finally {
      const responseTime = Date.now() - startTime;
      adaptiveRateLimiter.recordResponseTime(endpoint, responseTime);
    }
  }, [endpoint]);

  const recordError = useCallback(() => {
    adaptiveRateLimiter.recordError(endpoint);
  }, [endpoint]);

  const recordSuccess = useCallback((responseTime?: number) => {
    if (responseTime) {
      adaptiveRateLimiter.recordResponseTime(endpoint, responseTime);
    }
  }, [endpoint]);

  return {
    ...rateLimitState,
    checkRateLimit,
    recordError,
    recordSuccess
  };
};

function getUserIdentifier(): string {
  // Try to get user ID from session/auth
  const userId = localStorage.getItem('supabase.auth.token');
  if (userId) {
    try {
      const parsed = JSON.parse(userId);
      return parsed.user?.id || getClientIdentifier();
    } catch {
      return getClientIdentifier();
    }
  }
  return getClientIdentifier();
}

function getClientIdentifier(): string {
  // Fallback to IP-based identifier (simplified for demo)
  return `client_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}
