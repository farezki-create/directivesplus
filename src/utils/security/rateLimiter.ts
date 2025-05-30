
interface RateLimitRecord {
  count: number;
  windowStart: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class ClientRateLimiter {
  private attempts = new Map<string, RateLimitRecord>();

  checkLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, {
        count: 1,
        windowStart: now,
        lastAttempt: now
      });
      return true;
    }

    // Check if blocked
    if (record.blockedUntil && now < record.blockedUntil) {
      return false;
    }

    // Reset if window expired
    if (now - record.windowStart > windowMs) {
      this.attempts.set(key, {
        count: 1,
        windowStart: now,
        lastAttempt: now
      });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= maxAttempts) {
      record.blockedUntil = now + windowMs;
      this.attempts.set(key, record);
      return false;
    }

    // Increment count
    record.count++;
    record.lastAttempt = now;
    this.attempts.set(key, record);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const record = this.attempts.get(key);
    if (!record?.blockedUntil) return 0;
    
    return Math.max(0, record.blockedUntil - Date.now());
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (record.blockedUntil && now > record.blockedUntil) {
        this.attempts.delete(key);
      }
    }
  }
}

export const clientRateLimiter = new ClientRateLimiter();

// Clean up every 5 minutes
setInterval(() => {
  clientRateLimiter.cleanup();
}, 5 * 60 * 1000);
