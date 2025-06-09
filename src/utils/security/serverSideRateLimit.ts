
import { supabase } from "@/integrations/supabase/client";

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number;
}

interface RPCRateLimitResponse {
  allowed: boolean;
  remaining_attempts: number;
  retry_after?: number;
}

export class ServerSideRateLimit {
  static async checkRateLimit(
    identifier: string,
    attemptType: string,
    maxAttempts: number = 5,
    windowMinutes: number = 15,
    ipAddress?: string,
    userAgent?: string
  ): Promise<RateLimitResult> {
    try {
      // Use the new secure rate limiting function
      const { data, error } = await supabase
        .rpc('check_rate_limit_secure', {
          p_identifier: identifier,
          p_attempt_type: attemptType,
          p_max_attempts: maxAttempts,
          p_window_minutes: windowMinutes,
          p_ip_address: ipAddress || '127.0.0.1',
          p_user_agent: userAgent || navigator.userAgent
        });

      if (error) {
        console.error('Secure rate limit check failed:', error);
        // Fail secure - deny access if we can't check rate limit
        return { allowed: false, remainingAttempts: 0 };
      }

      // Check if data is null or empty
      if (!data || !Array.isArray(data) || data.length === 0) {
        return { allowed: false, remainingAttempts: 0 };
      }
      
      const result = data[0] as RPCRateLimitResponse;
      if (!result) {
        return { allowed: false, remainingAttempts: 0 };
      }
      
      return {
        allowed: result.allowed,
        remainingAttempts: result.remaining_attempts,
        retryAfter: result.retry_after || undefined
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: false, remainingAttempts: 0 };
    }
  }

  static async recordSuccessfulAttempt(
    identifier: string,
    attemptType: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await supabase.from('access_code_attempts').insert({
        ip_address: ipAddress || '127.0.0.1',
        user_agent: userAgent || navigator.userAgent,
        success: true
      });
    } catch (error) {
      console.error('Failed to record successful attempt:', error);
    }
  }
}
