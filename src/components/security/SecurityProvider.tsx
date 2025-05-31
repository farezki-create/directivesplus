
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';
import { EnhancedSessionSecurity } from '@/utils/security/enhancedSessionSecurity';
import { EnhancedSecurityEventLogger } from '@/utils/security/enhancedSecurityEventLogger';
import { ServerSideRateLimit } from '@/utils/security/serverSideRateLimit';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityContextType {
  validateSession: () => Promise<boolean>;
  clearSession: () => void;
  logSecurityEvent: (eventType: any, details?: any) => Promise<void>;
  checkRateLimit: (key: string, maxAttempts: number, windowMs: number) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  useSecurityHeaders();

  useEffect(() => {
    if (user) {
      // Initialize secure session when user is authenticated
      EnhancedSessionSecurity.initializeSecureSession(user.id);

      // Start periodic session validation
      const cleanup = EnhancedSessionSecurity.startPeriodicValidation(user.id);

      return cleanup;
    }
  }, [user]);

  useEffect(() => {
    // Monitor for suspicious activity patterns
    let clickCount = 0;
    let rapidClickStartTime = 0;

    const handleSuspiciousActivity = async () => {
      const now = Date.now();
      
      if (clickCount === 0) {
        rapidClickStartTime = now;
      }
      
      clickCount++;
      
      // Reset counter after 10 seconds
      if (now - rapidClickStartTime > 10000) {
        clickCount = 1;
        rapidClickStartTime = now;
      }
      
      // Detect rapid clicking (potential bot behavior)
      if (clickCount > 20) {
        await EnhancedSecurityEventLogger.logSuspiciousActivity(
          'rapid_clicking_detected',
          user?.id,
          undefined,
          navigator.userAgent,
          { click_count: clickCount, time_window: now - rapidClickStartTime }
        );
        clickCount = 0; // Reset to avoid spam
      }
    };

    // Monitor page visibility changes for security
    const handleVisibilityChange = async () => {
      if (!document.hidden && user) {
        // Re-validate session when page becomes visible
        const isValid = await EnhancedSessionSecurity.validateSecureSession(user.id);
        if (!isValid) {
          await EnhancedSecurityEventLogger.logSuspiciousActivity(
            'session_validation_failed_on_visibility',
            user.id
          );
          // Redirect to login
          window.location.href = '/auth';
        }
      }
    };

    // Monitor for potential XSS attempts using MutationObserver instead of deprecated DOMNodeInserted
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.innerHTML && element.innerHTML.includes('<script')) {
              EnhancedSecurityEventLogger.logSuspiciousActivity(
                'potential_xss_attempt',
                user?.id,
                undefined,
                navigator.userAgent,
                { element_tag: element.tagName, detected_content: 'script_tag' }
              );
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('click', handleSuspiciousActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleSuspiciousActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const validateSession = async () => {
    return await EnhancedSessionSecurity.validateSecureSession(user?.id);
  };

  const clearSession = () => {
    EnhancedSessionSecurity.clearSecureSession();
  };

  const logSecurityEvent = async (eventType: any, details?: any) => {
    await EnhancedSecurityEventLogger.logEvent({
      eventType,
      userId: user?.id,
      success: true,
      details
    });
  };

  const checkRateLimit = async (key: string, maxAttempts: number, windowMs: number): Promise<boolean> => {
    const windowMinutes = Math.ceil(windowMs / 60000);
    const result = await ServerSideRateLimit.checkRateLimit(
      key,
      'generic_action',
      maxAttempts,
      windowMinutes
    );
    return result.allowed;
  };

  const value: SecurityContextType = {
    validateSession,
    clearSession,
    logSecurityEvent,
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
