
import { useState, useEffect, useRef } from "react";
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
  // Use useRef instead of useState to avoid potential React queue issues
  const lastActivityTimeRef = useRef<number>(Date.now());
  const intervalIdRef = useRef<number | null>(null);
  
  // Reset activity time on user interaction
  const resetActivityTimer = () => {
    lastActivityTimeRef.current = Date.now();
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
    
    // Initialize the last activity time when the effect runs
    lastActivityTimeRef.current = Date.now();
    
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
    const checkInactivity = () => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimeRef.current;
      
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
        
        // Clear interval
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      }
    };
    
    // Start the interval and store its ID
    intervalIdRef.current = window.setInterval(checkInactivity, 10000);
    
    // Clean up interval on unmount
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [dossierId, inactivityTimeoutMinutes, onSessionExpired]);
  
  return {
    resetActivityTimer,
    logDossierEvent,
    handleSecurityClose
  };
};
