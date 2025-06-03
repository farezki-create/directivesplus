
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEmailConfirmationFlow = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);

  // Fonction pour nettoyer les paramètres d'authentification de l'URL
  const cleanAuthUrl = () => {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  };

  // Fonction pour détecter si c'est une confirmation d'email
  const checkEmailConfirmation = () => {
    // Vérifier les paramètres URL pour notre système personnalisé
    const emailConfirmed = searchParams.get('email_confirmed');
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type');
    
    // Vérifier aussi les paramètres Supabase standard
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const supabaseType = searchParams.get('type');
    
    // Vérifier aussi les fragments d'URL (format Supabase standard)
    const fragment = location.hash;
    const fragmentParams = new URLSearchParams(fragment.substring(1));
    const fragmentAccessToken = fragmentParams.get('access_token');
    const fragmentType = fragmentParams.get('type');
    
    console.log("🔍 Détection confirmation email:", {
      customParams: { emailConfirmed, userId, type },
      searchParams: { accessToken, refreshToken, supabaseType },
      fragment: { fragmentAccessToken, fragmentType },
      hash: location.hash,
      isAuthenticated,
      user: user?.id
    });

    return {
      isCustomConfirmation: emailConfirmed === 'true' && userId && type === 'signup',
      isSupabaseConfirmation: !!(accessToken || fragmentAccessToken) && (supabaseType === 'signup' || fragmentType === 'signup'),
      userId: userId,
      hasToken: !!(accessToken || fragmentAccessToken)
    };
  };

  useEffect(() => {
    const { isCustomConfirmation, isSupabaseConfirmation, userId } = checkEmailConfirmation();

    // Si c'est notre confirmation personnalisée
    if (isCustomConfirmation && userId && !isProcessingConfirmation) {
      console.log("✅ Confirmation email personnalisée détectée - début du processus 2FA");
      setIsProcessingConfirmation(true);
      
      // Nettoyer l'URL immédiatement
      cleanAuthUrl();
      
      // Récupérer les données utilisateur depuis le localStorage
      const pendingUserData = localStorage.getItem('pending_2fa_user');
      if (pendingUserData) {
        try {
          const userData = JSON.parse(pendingUserData);
          if (userData.userId === userId) {
            toast({
              title: "Email confirmé !",
              description: "Vérification par SMS requise pour finaliser votre inscription.",
              duration: 4000
            });
            
            // Activer le processus 2FA
            setPendingUserId(userId);
            setShowTwoFactorAuth(true);
            setIsProcessingConfirmation(false);
            
            // Nettoyer les données temporaires
            localStorage.removeItem('pending_2fa_user');
            return;
          }
        } catch (error) {
          console.error("Erreur lors de la lecture des données utilisateur:", error);
        }
      }
      
      // Si pas de données utilisateur, rediriger vers l'inscription
      toast({
        title: "Erreur de confirmation",
        description: "Session expirée. Veuillez vous inscrire à nouveau.",
        variant: "destructive"
      });
      navigate('/auth', { replace: true });
      setIsProcessingConfirmation(false);
      return;
    }

    // Si c'est une confirmation Supabase standard avec tokens
    if (isSupabaseConfirmation && !isProcessingConfirmation) {
      console.log("✅ Confirmation Supabase standard détectée - début du processus 2FA");
      setIsProcessingConfirmation(true);
      
      // Nettoyer l'URL immédiatement
      cleanAuthUrl();
      
      // Attendre un peu pour que Supabase traite la session
      setTimeout(async () => {
        try {
          // Vérifier la session Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          
          console.log("📋 Session après confirmation:", { session: !!session, error, userId: session?.user?.id });
          
          if (session?.user) {
            // L'utilisateur est maintenant authentifié, on le déconnecte temporairement pour le processus 2FA
            await supabase.auth.signOut();
            
            toast({
              title: "Email confirmé !",
              description: "Vérification par SMS requise pour finaliser votre inscription.",
              duration: 4000
            });
            
            // Activer le processus 2FA
            setPendingUserId(session.user.id);
            setShowTwoFactorAuth(true);
          } else {
            console.warn("⚠️ Pas de session après confirmation email");
            toast({
              title: "Erreur de confirmation",
              description: "Problème lors de la confirmation de l'email. Veuillez réessayer.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("❌ Erreur lors de la vérification de session:", error);
        } finally {
          setIsProcessingConfirmation(false);
        }
      }, 1000);
      
      return;
    }

    // Si l'utilisateur est authentifié et pas en cours de 2FA
    if (isAuthenticated && !showTwoFactorAuth && !isProcessingConfirmation) {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [searchParams, location.hash, isAuthenticated, user, showTwoFactorAuth, navigate, isProcessingConfirmation]);

  const handleTwoFactorSuccess = async () => {
    console.log("✅ 2FA validée - finalisation de l'inscription");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    
    toast({
      title: "Inscription finalisée !",
      description: "Votre compte a été créé avec succès. Bienvenue !",
      duration: 4000
    });
    
    // Forcer une redirection complète
    window.location.href = '/rediger';
  };

  const handleTwoFactorCancel = () => {
    console.log("❌ 2FA annulée");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    setIsProcessingConfirmation(false);
    
    // Nettoyer les données temporaires
    localStorage.removeItem('pending_2fa_user');
    
    navigate('/auth', { replace: true });
  };

  return {
    showTwoFactorAuth,
    pendingUserId,
    handleTwoFactorSuccess,
    handleTwoFactorCancel,
    isProcessingConfirmation
  };
};
