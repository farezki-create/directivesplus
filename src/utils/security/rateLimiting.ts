
import { ServerSideRateLimit } from './serverSideRateLimit';

interface AccessCodeAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class AccessCodeLimiter {
  private attempts = new Map<string, AccessCodeAttempt>();
  private readonly maxAttempts = 3; // Reduced from 5 for better security
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutes

  async recordAttempt(identifier: string, ipAddress?: string, userAgent?: string): Promise<{ blocked: boolean; remainingAttempts: number }> {
    // Use server-side rate limiting for critical operations
    const serverResult = await ServerSideRateLimit.checkRateLimit(
      identifier,
      'access_code_attempt',
      this.maxAttempts,
      this.windowMs / 60000, // Convert to minutes
      ipAddress,
      userAgent
    );

    if (!serverResult.allowed) {
      return { blocked: true, remainingAttempts: 0 };
    }

    // Continue with client-side tracking as backup
    const now = Date.now();
    const existing = this.attempts.get(identifier);

    if (!existing) {
      this.attempts.set(identifier, {
        count: 1,
        lastAttempt: now
      });
      return { blocked: false, remainingAttempts: this.maxAttempts - 1 };
    }

    // Check if currently blocked
    if (existing.blockedUntil && now < existing.blockedUntil) {
      return { blocked: true, remainingAttempts: 0 };
    }

    // Reset if window expired
    if (now - existing.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, {
        count: 1,
        lastAttempt: now
      });
      return { blocked: false, remainingAttempts: this.maxAttempts - 1 };
    }

    // Increment attempt count
    existing.count++;
    existing.lastAttempt = now;

    // Check if should block
    if (existing.count >= this.maxAttempts) {
      existing.blockedUntil = now + this.blockDurationMs;
      this.attempts.set(identifier, existing);
      return { blocked: true, remainingAttempts: 0 };
    }

    this.attempts.set(identifier, existing);
    return { 
      blocked: false, 
      remainingAttempts: this.maxAttempts - existing.count 
    };
  }

  isBlocked(identifier: string): boolean {
    const attempt = this.attempts.get(identifier);
    if (!attempt?.blockedUntil) return false;
    
    const now = Date.now();
    if (now > attempt.blockedUntil) {
      this.attempts.delete(identifier);
      return false;
    }
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt?.blockedUntil) return 0;
    
    return Math.max(0, attempt.blockedUntil - Date.now());
  }

  async reset(identifier: string, ipAddress?: string, userAgent?: string): Promise<void> {
    this.attempts.delete(identifier);
    
    // Record successful attempt in server-side tracking
    await ServerSideRateLimit.recordSuccessfulAttempt(
      identifier,
      'access_code_attempt',
      ipAddress,
      userAgent
    );
  }
}

export const accessCodeLimiter = new AccessCodeLimiter();
