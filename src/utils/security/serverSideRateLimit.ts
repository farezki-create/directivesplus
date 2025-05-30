
import { supabase } from "@/integrations/supabase/client";

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number;
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
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: identifier,
        p_attempt_type: attemptType,
        p_max_attempts: maxAttempts,
        p_window_minutes: windowMinutes,
        p_ip_address: ipAddress,
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        // Fail secure - deny access if we can't check rate limit
        return { allowed: false, remainingAttempts: 0 };
      }

      return {
        allowed: data,
        remainingAttempts: data ? maxAttempts - 1 : 0,
        retryAfter: data ? undefined : windowMinutes * 60
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
      await supabase.from('rate_limit_attempts').insert({
        identifier,
        attempt_type: attemptType,
        ip_address: ipAddress,
        user_agent: userAgent,
        success: true
      });
    } catch (error) {
      console.error('Failed to record successful attempt:', error);
    }
  }
}
