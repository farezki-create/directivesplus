
interface AccessCodeAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class AccessCodeLimiter {
  private attempts = new Map<string, AccessCodeAttempt>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutes

  recordAttempt(identifier: string): { blocked: boolean; remainingAttempts: number } {
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

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const accessCodeLimiter = new AccessCodeLimiter();
