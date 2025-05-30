
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedSecurityEventLogger } from '@/utils/security/enhancedSecurityEventLogger';

export const useSecurityMonitor = () => {
  const { user } = useAuth();

  // Monitor for rapid clicking (potential bot behavior)
  const monitorRapidClicking = useCallback(() => {
    let clickCount = 0;
    let rapidClickStartTime = 0;

    const handleClick = async () => {
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
      
      // Detect suspicious rapid clicking
      if (clickCount > 20) {
        await EnhancedSecurityEventLogger.logSuspiciousActivity(
          'rapid_clicking_detected',
          user?.id,
          undefined,
          navigator.userAgent,
          { 
            click_count: clickCount, 
            time_window: now - rapidClickStartTime,
            page_url: window.location.href
          }
        );
        clickCount = 0; // Reset to avoid spam
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => document.removeEventListener('click', handleClick);
  }, [user?.id]);

  // Monitor for suspicious page access patterns
  const monitorPageAccess = useCallback(async () => {
    if (!user) return;

    // Log page access
    await EnhancedSecurityEventLogger.logEvent({
      eventType: 'document_access',
      userId: user.id,
      success: true,
      riskLevel: 'low',
      details: {
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      }
    });
  }, [user]);

  // Monitor for potential XSS attempts
  const monitorXSSAttempts = useCallback(() => {
    const handleDOMNodeInserted = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.innerHTML && target.innerHTML.includes('<script')) {
        EnhancedSecurityEventLogger.logSuspiciousActivity(
          'potential_xss_attempt',
          user?.id,
          undefined,
          navigator.userAgent,
          { 
            element_tag: target.tagName, 
            detected_content: 'script_tag',
            page_url: window.location.href
          }
        );
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Note: DOMNodeInserted is deprecated but still works for XSS detection
    document.addEventListener('DOMNodeInserted', handleDOMNodeInserted);
    
    return () => document.removeEventListener('DOMNodeInserted', handleDOMNodeInserted);
  }, [user?.id]);

  // Monitor for tab/window visibility changes
  const monitorVisibilityChanges = useCallback(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && user) {
        // Page became visible - could indicate tab switching or return from background
        await EnhancedSecurityEventLogger.logEvent({
          eventType: 'document_access',
          userId: user.id,
          success: true,
          riskLevel: 'low',
          details: {
            event_type: 'page_visibility_changed',
            visibility_state: document.visibilityState,
            timestamp: new Date().toISOString()
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  // Monitor for copy/paste operations on sensitive fields
  const monitorClipboardOperations = useCallback(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if pasting into sensitive fields
      if (target.id?.includes('access') || 
          target.id?.includes('password') ||
          target.className?.includes('sensitive')) {
        
        const pastedData = event.clipboardData?.getData('text') || '';
        
        // Log if pasted content looks suspicious
        if (pastedData.length > 100 || 
            pastedData.includes('<script') ||
            pastedData.includes('javascript:')) {
          
          await EnhancedSecurityEventLogger.logSuspiciousActivity(
            'suspicious_paste_operation',
            user?.id,
            undefined,
            navigator.userAgent,
            {
              target_field: target.id || target.className,
              content_length: pastedData.length,
              contains_script: pastedData.includes('<script'),
              page_url: window.location.href
            }
          );
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    
    return () => document.removeEventListener('paste', handlePaste);
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    // Set up all monitors
    const cleanupFunctions = [
      monitorRapidClicking(),
      monitorXSSAttempts(),
      monitorVisibilityChanges(),
      monitorClipboardOperations()
    ];

    // Log initial page access
    monitorPageAccess();

    // Cleanup all monitors
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup?.());
    };
  }, [user, monitorRapidClicking, monitorXSSAttempts, monitorVisibilityChanges, monitorClipboardOperations, monitorPageAccess]);

  return {
    // Expose manual logging functions for specific events
    logSecurityEvent: EnhancedSecurityEventLogger.logEvent,
    logSuspiciousActivity: EnhancedSecurityEventLogger.logSuspiciousActivity,
    logDocumentAccess: EnhancedSecurityEventLogger.logDocumentAccess
  };
};
