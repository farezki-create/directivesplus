
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
  console.log("🧹 Nettoyage complet de l'état d'authentification");
  
  // Nettoyer localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log(`🗑️ Supprimé: ${key}`);
    }
  });
  
  // Nettoyer sessionStorage si utilisé
  try {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Session supprimée: ${key}`);
      }
    });
  } catch (e) {
    console.log("⚠️ SessionStorage non disponible");
  }
};

export const performGlobalSignOut = async () => {
  try {
    console.log("🚪 Tentative de déconnexion globale");
    cleanupAuthState();
    
    await supabase.auth.signOut({ scope: 'global' });
    console.log("✅ Déconnexion globale réussie");
  } catch (error) {
    console.log("⚠️ Erreur déconnexion (non bloquante):", error);
  }
};
