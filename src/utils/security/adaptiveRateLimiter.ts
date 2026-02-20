
interface EndpointMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: number;
  baseLimit: number;
  currentLimit: number;
  adjustmentFactor: number;
}

interface RateLimitConfig {
  baseLimit: number;
  windowMs: number;
  maxIncrease: number;
  maxDecrease: number;
  adjustmentInterval: number;
}

class AdaptiveRateLimiter {
  private endpointMetrics = new Map<string, EndpointMetrics>();
  private readonly configs = new Map<string, RateLimitConfig>();
  private readonly requestHistory = new Map<string, number[]>();

  constructor() {
    // Default configurations for different endpoint types
    this.setEndpointConfig('/api/auth/login', {
      baseLimit: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxIncrease: 2.0,
      maxDecrease: 0.5,
      adjustmentInterval: 5 * 60 * 1000 // 5 minutes
    });

    this.setEndpointConfig('/api/documents/upload', {
      baseLimit: 10,
      windowMs: 60 * 1000, // 1 minute
      maxIncrease: 1.5,
      maxDecrease: 0.3,
      adjustmentInterval: 2 * 60 * 1000 // 2 minutes
    });

    this.setEndpointConfig('/api/access/verify', {
      baseLimit: 20,
      windowMs: 60 * 1000, // 1 minute
      maxIncrease: 3.0,
      maxDecrease: 0.2,
      adjustmentInterval: 1 * 60 * 1000 // 1 minute
    });

    this.setEndpointConfig('/api/profiles', {
      baseLimit: 50,
      windowMs: 60 * 1000, // 1 minute
      maxIncrease: 2.0,
      maxDecrease: 0.4,
      adjustmentInterval: 3 * 60 * 1000 // 3 minutes
    });

    // Start adaptive adjustment loop
    this.startAdaptiveAdjustment();
  }

  setEndpointConfig(endpoint: string, config: RateLimitConfig): void {
    this.configs.set(endpoint, config);
    
    if (!this.endpointMetrics.has(endpoint)) {
      this.endpointMetrics.set(endpoint, {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 0,
        lastRequestTime: 0,
        baseLimit: config.baseLimit,
        currentLimit: config.baseLimit,
        adjustmentFactor: 1.0
      });
    }
  }

  async checkLimit(endpoint: string, identifier: string): Promise<{
    allowed: boolean;
    remainingRequests: number;
    resetTime: number;
    currentLimit: number;
  }> {
    const now = Date.now();
    const config = this.configs.get(endpoint);
    const metrics = this.endpointMetrics.get(endpoint);

    if (!config || !metrics) {
      // Default fallback
      return {
        allowed: true,
        remainingRequests: 100,
        resetTime: now + 60000,
        currentLimit: 100
      };
    }

    const key = `${endpoint}:${identifier}`;
    const history = this.requestHistory.get(key) || [];
    
    // Clean old requests outside the window
    const cutoff = now - config.windowMs;
    const recentRequests = history.filter(time => time > cutoff);
    
    // Update history
    this.requestHistory.set(key, recentRequests);

    // Record this request attempt
    this.recordRequest(endpoint, now);

    const currentRequestCount = recentRequests.length;
    const allowed = currentRequestCount < metrics.currentLimit;

    if (allowed) {
      recentRequests.push(now);
      this.requestHistory.set(key, recentRequests);
    }

    return {
      allowed,
      remainingRequests: Math.max(0, metrics.currentLimit - currentRequestCount),
      resetTime: now + config.windowMs,
      currentLimit: metrics.currentLimit
    };
  }

  recordError(endpoint: string): void {
    const metrics = this.endpointMetrics.get(endpoint);
    if (metrics) {
      metrics.errorCount++;
    }
  }

  recordResponseTime(endpoint: string, responseTime: number): void {
    const metrics = this.endpointMetrics.get(endpoint);
    if (metrics) {
      // Calculate moving average
      const alpha = 0.1; // Smoothing factor
      metrics.averageResponseTime = 
        metrics.averageResponseTime * (1 - alpha) + responseTime * alpha;
    }
  }

  private recordRequest(endpoint: string, timestamp: number): void {
    const metrics = this.endpointMetrics.get(endpoint);
    if (metrics) {
      metrics.requestCount++;
      metrics.lastRequestTime = timestamp;
    }
  }

  private startAdaptiveAdjustment(): void {
    setInterval(() => {
      this.adjustLimits();
    }, 60 * 1000); // Check every minute
  }

  private adjustLimits(): void {
    const now = Date.now();

    for (const [endpoint, metrics] of this.endpointMetrics.entries()) {
      const config = this.configs.get(endpoint);
      if (!config) continue;

      // Check if it's time to adjust
      const timeSinceLastAdjustment = now - (metrics.lastRequestTime || 0);
      if (timeSinceLastAdjustment < config.adjustmentInterval) {
        continue;
      }

      const errorRate = metrics.requestCount > 0 ? 
        metrics.errorCount / metrics.requestCount : 0;

      // Calculate load factor based on recent activity
      const recentActivity = this.getRecentActivity(endpoint);
      const loadFactor = recentActivity / metrics.currentLimit;

      // Determine adjustment based on multiple factors
      let newAdjustmentFactor = metrics.adjustmentFactor;

      // Increase limits if:
      // - Low error rate
      // - Good response times
      // - Consistent load without exceeding limits
      if (errorRate < 0.05 && 
          metrics.averageResponseTime < 1000 && 
          loadFactor > 0.7 && loadFactor < 0.95) {
        newAdjustmentFactor = Math.min(
          config.maxIncrease, 
          metrics.adjustmentFactor * 1.1
        );
      }

      // Decrease limits if:
      // - High error rate
      // - Poor response times
      // - Frequent limit violations
      else if (errorRate > 0.15 || 
               metrics.averageResponseTime > 3000 || 
               loadFactor > 1.0) {
        newAdjustmentFactor = Math.max(
          config.maxDecrease,
          metrics.adjustmentFactor * 0.8
        );
      }

      // Apply adjustment
      metrics.adjustmentFactor = newAdjustmentFactor;
      metrics.currentLimit = Math.round(metrics.baseLimit * newAdjustmentFactor);

      // Reset counters for next interval
      metrics.requestCount = 0;
      metrics.errorCount = 0;

      
    }
  }

  private getRecentActivity(endpoint: string): number {
    const now = Date.now();
    const config = this.configs.get(endpoint);
    if (!config) return 0;

    let totalRequests = 0;
    const cutoff = now - config.windowMs;

    for (const [key, history] of this.requestHistory.entries()) {
      if (key.startsWith(endpoint + ':')) {
        totalRequests += history.filter(time => time > cutoff).length;
      }
    }

    return totalRequests;
  }

  getMetrics(endpoint?: string): Map<string, EndpointMetrics> | EndpointMetrics | null {
    if (endpoint) {
      return this.endpointMetrics.get(endpoint) || null;
    }
    return this.endpointMetrics;
  }

  // Clean up old data periodically
  cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, history] of this.requestHistory.entries()) {
      const recentHistory = history.filter(time => now - time < maxAge);
      if (recentHistory.length === 0) {
        this.requestHistory.delete(key);
      } else {
        this.requestHistory.set(key, recentHistory);
      }
    }
  }
}

export const adaptiveRateLimiter = new AdaptiveRateLimiter();

// Cleanup every hour
setInterval(() => {
  adaptiveRateLimiter.cleanup();
}, 60 * 60 * 1000);
