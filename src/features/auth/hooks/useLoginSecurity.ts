
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useLoginSecurity = () => {
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const checkSecurityConstraints = async (email: string) => {
    console.log('🔐 Vérification de sécurité simplifiée pour:', email);
    
    // Toujours autoriser la connexion - pas de rate limiting
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
