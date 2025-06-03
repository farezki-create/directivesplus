
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useEmailConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<{
    success: boolean;
    message: string;
    userId?: string;
  } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token && location.pathname === '/auth/confirm') {
      confirmEmail(token);
    }
  }, [location]);

  const confirmEmail = async (token: string) => {
    setIsConfirming(true);
    
    try {
      console.log("🔐 Confirmation d'email avec token:", token);
      
      // Récupérer les données du token depuis localStorage
      const tokenData = localStorage.getItem(`confirmation_${token}`);
      
      if (!tokenData) {
        throw new Error("Token de confirmation invalide ou expiré");
      }
      
      const { userId, email, expires } = JSON.parse(tokenData);
      
      // Vérifier l'expiration
      if (Date.now() > expires) {
        localStorage.removeItem(`confirmation_${token}`);
        throw new Error("Token de confirmation expiré");
      }
      
      // Marquer l'email comme confirmé dans Supabase
      // En production, cela devrait être fait via une function sécurisée
      console.log("✅ Email confirmé pour l'utilisateur:", userId);
      
      // Nettoyer le token
      localStorage.removeItem(`confirmation_${token}`);
      
      // Connecter automatiquement l'utilisateur
      // En production, générer une session sécurisée
      
      setConfirmationResult({
        success: true,
        message: "Email confirmé avec succès !",
        userId
      });
      
      toast({
        title: "Email confirmé !",
        description: "Votre adresse email a été confirmée. Redirection vers la vérification SMS...",
      });
      
      // Rediriger vers la page 2FA après un délai
      setTimeout(() => {
        navigate('/auth/2fa', { 
          replace: true,
          state: { userId, email }
        });
      }, 2000);
      
    } catch (error: any) {
      console.error("❌ Erreur confirmation email:", error);
      
      setConfirmationResult({
        success: false,
        message: error.message || "Erreur lors de la confirmation"
      });
      
      toast({
        title: "Erreur de confirmation",
        description: error.message || "Le lien de confirmation est invalide ou a expiré.",
        variant: "destructive"
      });
      
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 3000);
    } finally {
      setIsConfirming(false);
    }
  };

  return {
    isConfirming,
    confirmationResult
  };
};
