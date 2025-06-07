
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
