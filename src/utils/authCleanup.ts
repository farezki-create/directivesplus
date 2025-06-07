
import { supabase } from "@/integrations/supabase/client";

/**
 * Nettoie complètement l'état d'authentification
 * Supprime toutes les sessions et données stockées
 */
export const cleanupAuthState = async () => {
  console.log("🧹 Nettoyage complet de l'état d'authentification");
  
  try {
    // Forcer la déconnexion Supabase
    await supabase.auth.signOut({ scope: 'global' });
  } catch (error) {
    console.log("⚠️ Erreur lors de la déconnexion Supabase:", error);
  }
  
  // Nettoyer localStorage
  const localStorageKeysToRemove = [
    'user_email',
    'sb-access-token',
    'sb-refresh-token'
  ];
  
  localStorageKeysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Nettoyer toutes les clés Supabase auth
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Nettoyer sessionStorage
  try {
    const sessionStorageKeysToRemove = [
      'user_email',
      'sb-access-token',
      'sb-refresh-token'
    ];
    
    sessionStorageKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.log("⚠️ SessionStorage non disponible");
  }
  
  console.log("✅ Nettoyage de l'état d'authentification terminé");
};

/**
 * Nettoie uniquement les données email stockées
 */
export const cleanupEmailData = () => {
  console.log("🧹 Nettoyage des données email");
  
  localStorage.removeItem('user_email');
  try {
    sessionStorage.removeItem('user_email');
  } catch (e) {
    console.log("⚠️ SessionStorage non disponible");
  }
};
