
import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  try {
    // Supprimer toutes les clés Supabase du localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Supprimer toutes les clés Supabase du sessionStorage
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('🧹 État d\'authentification nettoyé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};

export const performGlobalSignOut = async () => {
  try {
    cleanupAuthState();
    
    // Tentative de déconnexion globale Supabase
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.warn('⚠️ Erreur lors de la déconnexion Supabase:', error);
    }
    
    console.log('✅ Déconnexion globale effectuée');
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion globale:', error);
  }
};

export const validateTokenIntegrity = (token: string): boolean => {
  try {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    if (token.length < 20) {
      return false;
    }
    
    if (token.includes(' ') || token.includes('\n') || token.includes('\t')) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur validation token:', error);
    return false;
  }
};
