
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
  console.log("🧹 Nettoyage complet de l'état d'authentification");
  
  // Nettoyer localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log(`Supprimé de localStorage: ${key}`);
    }
  });
  
  // Nettoyer sessionStorage
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
      console.log(`Supprimé de sessionStorage: ${key}`);
    }
  });
  
  // Nettoyer les cookies d'authentification
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.includes('supabase') || name.includes('sb-')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      console.log(`Cookie supprimé: ${name}`);
    }
  });
};

export const performGlobalSignOut = async () => {
  try {
    cleanupAuthState();
    await supabase.auth.signOut({ scope: 'global' });
    console.log("✅ Déconnexion globale réussie");
  } catch (error) {
    console.log("⚠️ Erreur lors de la déconnexion (ignorée):", error);
  }
};
