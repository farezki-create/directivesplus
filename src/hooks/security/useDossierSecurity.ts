
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { logDossierSecurityEvent } from "@/utils/security/securityEventLogger";
import { createSecurityTimeout, DEFAULT_SECURITY_TIMEOUT_MS } from "@/utils/security/timeoutManager";

/**
 * Hook to manage dossier security features including activity timeout
 */
export const useDossierSecurity = () => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Reset the activity timer
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Handle security close (redirect to home)
  const handleSecurityClose = useCallback(() => {
    logDossierSecurityEvent("close", true);
    navigate('/');
  }, [navigate]);

  // Start security monitoring
  const startSecurityMonitoring = useCallback(() => {
    const { startTimeout } = createSecurityTimeout(() => {
      navigate('/');
    }, DEFAULT_SECURITY_TIMEOUT_MS);

    const newTimeoutId = startTimeout();
    setTimeoutId(newTimeoutId);
  }, [navigate]);

  // Stop security monitoring
  const stopSecurityMonitoring = useCallback(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  // Reset timer when lastActivity changes
  useEffect(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    const { startTimeout } = createSecurityTimeout(() => {
      navigate('/');
    }, DEFAULT_SECURITY_TIMEOUT_MS);

    const newTimeoutId = startTimeout();
    setTimeoutId(Number(newTimeoutId));

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [lastActivity, navigate]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    resetActivityTimer,
    logDossierEvent: logDossierSecurityEvent,
    handleSecurityClose,
    startSecurityMonitoring,
    stopSecurityMonitoring
  };
};
