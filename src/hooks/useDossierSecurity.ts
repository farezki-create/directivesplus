
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Default timeout of 5 minutes
const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;

export const useDossierSecurity = () => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Reset the activity timer
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Log dossier events
  const logDossierEvent = useCallback((action: string, success: boolean) => {
    console.log(`Dossier event: ${action}, success: ${success}`);
    // Here you could send this to an analytics service or log it server-side
  }, []);

  // Handle security close (redirect to home)
  const handleSecurityClose = useCallback(() => {
    logDossierEvent("close", true);
    navigate('/');
  }, [navigate, logDossierEvent]);

  // Start security monitoring
  const startSecurityMonitoring = useCallback(() => {
    // Clear any existing timeout
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = window.setTimeout(() => {
      toast({
        title: "Session expirée",
        description: "Votre session a expiré pour des raisons de sécurité.",
        variant: "destructive"
      });
      logDossierEvent("timeout", true);
      navigate('/');
    }, DEFAULT_TIMEOUT_MS);

    setTimeoutId(Number(newTimeoutId));
  }, [navigate, timeoutId, logDossierEvent]);

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

    const newTimeoutId = window.setTimeout(() => {
      toast({
        title: "Session expirée",
        description: "Votre session a expiré pour des raisons de sécurité.",
        variant: "destructive"
      });
      logDossierEvent("timeout", true);
      navigate('/');
    }, DEFAULT_TIMEOUT_MS);

    setTimeoutId(Number(newTimeoutId));

    return () => {
      if (newTimeoutId) {
        window.clearTimeout(newTimeoutId);
      }
    };
  }, [lastActivity, navigate, logDossierEvent]);

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
    logDossierEvent,
    handleSecurityClose,
    startSecurityMonitoring,
    stopSecurityMonitoring
  };
};
