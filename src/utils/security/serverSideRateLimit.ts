
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
      // Since the check_rate_limit function doesn't exist yet, 
      // use existing access_code_attempts table as fallback
      const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
      
      const { count, error } = await supabase
        .from('access_code_attempts')
        .select('*', { count: 'exact' })
        .eq('access_code', identifier)
        .gte('attempt_time', windowStart.toISOString())
        .eq('success', false);

      if (error) {
        console.error('Rate limit check failed:', error);
        // Fail secure - deny access if we can't check rate limit
        return { allowed: false, remainingAttempts: 0 };
      }

      const attemptCount = count || 0;
      const allowed = attemptCount < maxAttempts;
      
      return {
        allowed,
        remainingAttempts: Math.max(0, maxAttempts - attemptCount - 1),
        retryAfter: allowed ? undefined : windowMinutes * 60
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
        access_code: identifier,
        ip_address: ipAddress,
        user_agent: userAgent,
        success: true
      });
    } catch (error) {
      console.error('Failed to record successful attempt:', error);
    }
  }
}
