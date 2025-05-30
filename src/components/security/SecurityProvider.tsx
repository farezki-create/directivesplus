
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';
import { SessionSecurity } from '@/utils/security/sessionSecurity';
import { clientRateLimiter } from '@/utils/security/rateLimiter';

interface SecurityContextType {
  validateSession: () => boolean;
  clearSession: () => void;
  checkRateLimit: (key: string, maxAttempts: number, windowMs: number) => boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useSecurityHeaders();

  useEffect(() => {
    // Initialize session security
    SessionSecurity.initializeSession();

    // Validate session periodically
    const interval = setInterval(() => {
      if (!SessionSecurity.validateSession()) {
        SessionSecurity.logSecurityEvent('session_validation_failed');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Log page visibility changes for security monitoring
    const handleVisibilityChange = () => {
      if (document.hidden) {
        SessionSecurity.logSecurityEvent('page_hidden');
      } else {
        SessionSecurity.logSecurityEvent('page_visible');
        // Re-validate session when page becomes visible
        SessionSecurity.validateSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Detect suspicious activity
    let clickCount = 0;
    const handleSuspiciousActivity = () => {
      clickCount++;
      if (clickCount > 100) { // Threshold for suspicious clicking
        SessionSecurity.logSecurityEvent('suspicious_activity_detected', {
          type: 'excessive_clicking',
          count: clickCount
        });
      }
    };

    document.addEventListener('click', handleSuspiciousActivity);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleSuspiciousActivity);
    };
  }, []);

  const validateSession = () => {
    return SessionSecurity.validateSession();
  };

  const clearSession = () => {
    SessionSecurity.clearSession();
  };

  const checkRateLimit = (key: string, maxAttempts: number, windowMs: number) => {
    return clientRateLimiter.checkLimit(key, maxAttempts, windowMs);
  };

  const value: SecurityContextType = {
    validateSession,
    clearSession,
    checkRateLimit
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
