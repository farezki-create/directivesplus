
import { useState, useCallback } from 'react';
import { ServerSideRateLimit } from '@/utils/security/serverSideRateLimit';

interface UseSecureRateLimitOptions {
  maxAttempts?: number;
  windowMinutes?: number;
}

interface RateLimitState {
  isBlocked: boolean;
  remainingAttempts: number;
  retryAfter?: number;
  loading: boolean;
}

export const useSecureRateLimit = (
  identifier: string,
  attemptType: string,
  options: UseSecureRateLimitOptions = {}
) => {
  const { maxAttempts = 5, windowMinutes = 15 } = options;
  
  const [state, setState] = useState<RateLimitState>({
    isBlocked: false,
    remainingAttempts: maxAttempts,
    loading: false
  });

  const checkRateLimit = useCallback(async (
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const result = await ServerSideRateLimit.checkRateLimit(
        identifier,
        attemptType,
        maxAttempts,
        windowMinutes,
        ipAddress,
        userAgent
      );

      setState({
        isBlocked: !result.allowed,
        remainingAttempts: result.remainingAttempts,
        retryAfter: result.retryAfter,
        loading: false
      });

      return result.allowed;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      setState({
        isBlocked: true,
        remainingAttempts: 0,
        loading: false
      });
      return false;
    }
  }, [identifier, attemptType, maxAttempts, windowMinutes]);

  const recordSuccess = useCallback(async (
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> => {
    await ServerSideRateLimit.recordSuccessfulAttempt(
      identifier,
      attemptType,
      ipAddress,
      userAgent
    );
    
    // Reset the blocked state on successful attempt
    setState(prev => ({
      ...prev,
      isBlocked: false,
      remainingAttempts: maxAttempts
    }));
  }, [identifier, attemptType, maxAttempts]);

  return {
    ...state,
    checkRateLimit,
    recordSuccess
  };
};
