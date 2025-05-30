
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isBlocked(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      return false;
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      this.attempts.delete(identifier);
      return false;
    }

    return entry.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): { blocked: boolean; remainingAttempts: number; resetTime: number } {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs
      };
      this.attempts.set(identifier, newEntry);
      
      return {
        blocked: false,
        remainingAttempts: this.maxAttempts - 1,
        resetTime: newEntry.resetTime
      };
    } else {
      // Increment existing
      entry.count++;
      this.attempts.set(identifier, entry);
      
      return {
        blocked: entry.count >= this.maxAttempts,
        remainingAttempts: Math.max(0, this.maxAttempts - entry.count),
        resetTime: entry.resetTime
      };
    }
  }

  getRemainingTime(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return 0;
    
    return Math.max(0, entry.resetTime - Date.now());
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Global rate limiters for different operations
export const accessCodeLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const loginLimiter = new RateLimiter(10, 15 * 60 * 1000); // 10 attempts per 15 minutes
export const documentAccessLimiter = new RateLimiter(20, 60 * 60 * 1000); // 20 attempts per hour

// Cleanup every 5 minutes
setInterval(() => {
  accessCodeLimiter.cleanup();
  loginLimiter.cleanup();
  documentAccessLimiter.cleanup();
}, 5 * 60 * 1000);

export { RateLimiter };
