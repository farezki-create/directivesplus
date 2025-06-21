
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useLoginSecurity = () => {
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const checkSecurityConstraints = async (email: string) => {
    // Suppression de toutes les vérifications de rate limiting côté client
    // pour éviter les blocages d'envoi d'emails
    
    console.log('🔐 Vérification de sécurité simplifiée pour:', email);
    
    // Toujours autoriser la connexion
    return { allowed: true };
  };

  const handleSuccessfulLogin = (email: string) => {
    setSecurityWarning(null);
    console.log('✅ Connexion réussie pour:', email);
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
