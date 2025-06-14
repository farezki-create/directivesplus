
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { logDossierSecurityEvent } from "@/utils/security/securityEventLogger";
import { createHDSSecurityTimeout, DEFAULT_SECURITY_TIMEOUT_MS } from "@/utils/security/timeoutManager";
import { HDSSessionManager } from "@/utils/security/hdsSessionManager";

/**
 * Hook pour gérer la sécurité des dossiers avec conformité HDS
 */
export const useDossierSecurity = () => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Reset du timer d'activité
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Gestion de la fermeture sécurisée
  const handleSecurityClose = useCallback(() => {
    logDossierSecurityEvent("hds_document_close", true);
    navigate('/');
  }, [navigate]);

  // Démarrage du monitoring de sécurité
  const startSecurityMonitoring = useCallback(() => {
    // Vérifier d'abord la session HDS
    if (!HDSSessionManager.isSessionValid()) {
      navigate('/auth');
      return;
    }

    const { startTimeout } = createHDSSecurityTimeout(() => {
      toast({
        title: "Timeout HDS",
        description: "L'accès au document a expiré selon les règles HDS.",
        variant: "destructive"
      });
      navigate('/');
    }, DEFAULT_SECURITY_TIMEOUT_MS);

    const newTimeoutId = startTimeout();
    if (newTimeoutId) {
      setTimeoutId(newTimeoutId);
    }
  }, [navigate]);

  // Arrêt du monitoring de sécurité
  const stopSecurityMonitoring = useCallback(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  // Reset du timer lors des changements d'activité
  useEffect(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    // Vérifier la session HDS avant de créer un nouveau timeout
    if (!HDSSessionManager.isSessionValid()) {
      navigate('/auth');
      return;
    }

    const { startTimeout } = createHDSSecurityTimeout(() => {
      navigate('/');
    }, DEFAULT_SECURITY_TIMEOUT_MS);

    const newTimeoutId = startTimeout();
    if (newTimeoutId) {
      setTimeoutId(Number(newTimeoutId));
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [lastActivity, navigate]);

  // Nettoyage au démontage
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
