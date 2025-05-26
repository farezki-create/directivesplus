
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { checkAuthAttempt, resetAuthAttempts, detectSuspiciousLocation } from "@/utils/security/authSecurity";
import { clientRateLimiter } from "@/utils/security/rateLimiter";

export const useLoginSecurity = () => {
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const checkSecurityConstraints = async (email: string) => {
    // Rate limiting côté client (5 tentatives par 15 minutes)
    const rateLimitKey = `login_${email}`;
    if (!clientRateLimiter.checkLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      const remainingTime = clientRateLimiter.getRemainingTime(rateLimitKey);
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
      
      toast({
        title: "Trop de tentatives",
        description: `Veuillez patienter ${remainingMinutes} minute(s) avant de réessayer.`,
        variant: "destructive",
        duration: 8000
      });
      return { allowed: false };
    }

    // Vérifier la protection anti-brute force serveur
    const bruteForceCheck = checkAuthAttempt(email, 'login');
    if (!bruteForceCheck.allowed) {
      toast({
        title: "Tentatives de connexion bloquées",
        description: `Trop de tentatives. Réessayez dans ${bruteForceCheck.lockoutMinutes} minutes.`,
        variant: "destructive",
        duration: 8000
      });
      return { allowed: false };
    }

    // Afficher un avertissement si peu de tentatives restantes
    if (bruteForceCheck.remainingAttempts <= 2) {
      setSecurityWarning(`Attention: ${bruteForceCheck.remainingAttempts} tentative(s) restante(s) avant blocage temporaire.`);
    }

    // Vérifier la géolocalisation suspecte
    const suspiciousLocation = await detectSuspiciousLocation();
    if (suspiciousLocation) {
      toast({
        title: "Connexion depuis un nouveau lieu",
        description: "Nous avons détecté une connexion depuis un nouveau lieu. Vérifiez votre email pour confirmation.",
        variant: "default",
        duration: 6000
      });
    }

    return { allowed: true, bruteForceCheck };
  };

  const handleSuccessfulLogin = (email: string) => {
    resetAuthAttempts(email, 'login');
    setSecurityWarning(null);
  };

  const clearSecurityWarning = () => {
    setSecurityWarning(null);
  };

  return {
    securityWarning,
    checkSecurityConstraints,
    handleSuccessfulLogin,
    clearSecurityWarning
  };
};
