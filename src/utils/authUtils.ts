
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
  console.log("🧹 Nettoyage de l'état d'authentification");
  
  // Nettoyer localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Nettoyer sessionStorage
  try {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.log("⚠️ SessionStorage non disponible");
  }
};

export const performGlobalSignOut = async () => {
  try {
    cleanupAuthState();
    await supabase.auth.signOut({ scope: 'global' });
  } catch (error) {
    console.log("⚠️ Erreur déconnexion:", error);
  }
};
