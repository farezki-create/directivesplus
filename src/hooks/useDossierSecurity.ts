
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { logAccessEvent } from "@/utils/accessLoggingUtils";

/**
 * Hook for managing security aspects of a dossier session, including:
 * - Inactivity timeout
 * - Session logging
 * - Dossier closure
 */
export const useDossierSecurity = (
  dossierId: string | undefined,
  onSessionExpired: () => void,
  inactivityTimeoutMinutes: number = 15
) => {
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  
  // Reset activity time on user interaction
  const resetActivityTimer = () => {
    setLastActivityTime(Date.now());
  };
  
  // Log access event
  const logDossierEvent = (action: string, success: boolean) => {
    if (!dossierId) return;
    
    logAccessEvent({
      userId: '00000000-0000-0000-0000-000000000000',
      accessCodeId: dossierId,
      resourceType: "dossier",
      resourceId: dossierId,
      action,
      success
    });
  };
  
  // Handle dossier closure
  const handleSecurityClose = () => {
    if (dossierId) {
      logDossierEvent("access", true);
    }
    onSessionExpired();
  };

  // Set up event listeners for user activity
  useEffect(() => {
    if (!dossierId) return;
    
    // Event handlers to reset inactivity timeout
    const handleUserActivity = () => resetActivityTimer();
    
    // Register event listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    
    // Cleanup event listeners on component destruction
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [dossierId]);
  
  // Check for inactivity and handle session expiration
  useEffect(() => {
    if (!dossierId) return;
    
    const inactivityTimeoutMs = inactivityTimeoutMinutes * 60 * 1000;
    
    // Set interval to check for inactivity
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTime;
      
      if (timeSinceLastActivity >= inactivityTimeoutMs) {
        toast({
          title: "Session expirée",
          description: "Votre session a expiré pour des raisons de sécurité",
          variant: "default"
        });
        
        // Log session expiration
        logDossierEvent("timeout", true);
        
        // Close dossier
        onSessionExpired();
        
        // Clear this interval
        clearInterval(intervalId);
      }
    }, 10000); // Check every 10 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [dossierId, lastActivityTime, inactivityTimeoutMinutes, onSessionExpired]);
  
  return {
    resetActivityTimer,
    logDossierEvent,
    handleSecurityClose
  };
};
