
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';
import { HDSSessionManager } from '@/utils/security/hdsSessionManager';
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
      // Initialiser la gestion de session HDS conforme (8h max, auto-lock 30min)
      HDSSessionManager.setSessionStartTime();
      HDSSessionManager.initializeHDSSession();
      
      
    }
  }, [user]);

  useEffect(() => {
    // Surveillance continue des patterns suspects
    let clickCount = 0;
    let rapidClickStartTime = 0;

    const handleSuspiciousActivity = async () => {
      const now = Date.now();
      
      if (clickCount === 0) {
        rapidClickStartTime = now;
      }
      
      clickCount++;
      
      // Reset après 10 secondes
      if (now - rapidClickStartTime > 10000) {
        clickCount = 1;
        rapidClickStartTime = now;
      }
      
      // Détecter les clics rapides (comportement de bot potentiel)
      if (clickCount > 20) {
        await EnhancedSecurityEventLogger.logSuspiciousActivity(
          'rapid_clicking_detected',
          user?.id,
          undefined,
          navigator.userAgent,
          { click_count: clickCount, time_window: now - rapidClickStartTime }
        );
        clickCount = 0;
      }
    };

    // Surveiller les changements de visibilité pour la sécurité
    const handleVisibilityChange = async () => {
      if (!document.hidden && user) {
        // Re-valider la session HDS quand la page devient visible
        const isValid = HDSSessionManager.isSessionValid();
        if (!isValid) {
          await EnhancedSecurityEventLogger.logSuspiciousActivity(
            'hds_session_validation_failed_on_visibility',
            user.id
          );
          // Redirection vers l'authentification
          window.location.href = '/auth';
        }
      }
    };

    // Surveiller les tentatives XSS potentielles avec MutationObserver
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

    // Démarrer l'observation
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
      
      // Nettoyage des sessions HDS au démontage
      if (user) {
        HDSSessionManager.destroy();
      }
    };
  }, [user]);

  const validateSession = async () => {
    return HDSSessionManager.isSessionValid();
  };

  const clearSession = () => {
    HDSSessionManager.destroy();
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
