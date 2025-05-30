
interface AuthAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const authAttempts = new Map<string, AuthAttempt>();

// Enhanced brute force protection
export const checkAuthAttempt = (
  identifier: string, 
  action: 'login' | 'access_code' = 'login'
): { allowed: boolean; remainingAttempts: number; lockoutMinutes: number } => {
  const maxAttempts = action === 'login' ? 5 : 3;
  const lockoutTime = action === 'login' ? 15 : 30; // minutes
  const now = Date.now();
  
  const attempt = authAttempts.get(identifier);
  
  if (!attempt) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1, lockoutMinutes: 0 };
  }
  
  // Check if lockout has expired
  if (attempt.lockedUntil && now > attempt.lockedUntil) {
    authAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: maxAttempts - 1, lockoutMinutes: 0 };
  }
  
  // Check if currently locked
  if (attempt.lockedUntil && now <= attempt.lockedUntil) {
    const remainingLockout = Math.ceil((attempt.lockedUntil - now) / (1000 * 60));
    return { allowed: false, remainingAttempts: 0, lockoutMinutes: remainingLockout };
  }
  
  // Reset count if more than 1 hour has passed
  if (now - attempt.lastAttempt > 60 * 60 * 1000) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1, lockoutMinutes: 0 };
  }
  
  // Increment attempt count
  attempt.count++;
  attempt.lastAttempt = now;
  
  if (attempt.count >= maxAttempts) {
    attempt.lockedUntil = now + (lockoutTime * 60 * 1000);
    authAttempts.set(identifier, attempt);
    return { allowed: false, remainingAttempts: 0, lockoutMinutes: lockoutTime };
  }
  
  authAttempts.set(identifier, attempt);
  return { 
    allowed: true, 
    remainingAttempts: maxAttempts - attempt.count, 
    lockoutMinutes: 0 
  };
};

// Reset auth attempts after successful login
export const resetAuthAttempts = (identifier: string, action: 'login' | 'access_code' = 'login') => {
  authAttempts.delete(identifier);
  console.log(`Reset auth attempts for ${action}:`, identifier);
};

// Enhanced geolocation detection
export const detectSuspiciousLocation = async (): Promise<boolean> => {
  try {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Check for known trusted locations (this would be enhanced with IP geolocation)
    const trustedTimezones = [
      'Europe/Paris',
      'Europe/London',
      'America/New_York',
      'America/Los_Angeles'
    ];
    
    const isSuspicious = !trustedTimezones.includes(userTimezone);
    
    // Log suspicious location attempt
    if (isSuspicious) {
      console.warn('Suspicious location detected:', {
        timezone: userTimezone,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
    
    return isSuspicious;
  } catch (error) {
    console.error('Error detecting location:', error);
    return false;
  }
};

// Enhanced session security
export const validateSession = (): boolean => {
  try {
    // Check for session hijacking indicators
    const sessionStart = sessionStorage.getItem('session_start');
    const sessionUA = sessionStorage.getItem('session_ua');
    const currentUA = navigator.userAgent;
    
    if (!sessionStart) {
      sessionStorage.setItem('session_start', Date.now().toString());
      sessionStorage.setItem('session_ua', currentUA);
      return true;
    }
    
    // Check if user agent changed (potential session hijacking)
    if (sessionUA && sessionUA !== currentUA) {
      console.warn('Session validation failed: User agent mismatch');
      sessionStorage.clear();
      return false;
    }
    
    // Check session age (max 24 hours)
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > maxAge) {
      console.warn('Session validation failed: Session expired');
      sessionStorage.clear();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

// Clean up expired attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, attempt] of authAttempts.entries()) {
    if (attempt.lockedUntil && now > attempt.lockedUntil) {
      authAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes
