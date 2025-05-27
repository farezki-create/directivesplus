
/**
 * Helper function to clean up Supabase auth state
 * Removes all auth-related localStorage and sessionStorage items
 */
export const cleanupAuthState = () => {
  console.log("🧹 === NETTOYAGE ULTRA AGRESSIF DE L'ÉTAT D'AUTHENTIFICATION === 🧹");
  
  try {
    // Nettoyage BRUTAL et COMPLET de localStorage
    console.log("💾 Nettoyage localStorage...");
    const localStorageKeys = Object.keys(localStorage);
    console.log(`Found ${localStorageKeys.length} localStorage keys`);
    
    localStorageKeys.forEach((key) => {
      if (key.startsWith('supabase') || 
          key.includes('sb-') || 
          key.includes('auth') ||
          key.includes('token') ||
          key.includes('session') ||
          key.includes('user')) {
        console.log(`🗑️ Suppression localStorage: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Nettoyage BRUTAL et COMPLET de sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      console.log("💾 Nettoyage sessionStorage...");
      const sessionStorageKeys = Object.keys(sessionStorage);
      console.log(`Found ${sessionStorageKeys.length} sessionStorage keys`);
      
      sessionStorageKeys.forEach((key) => {
        if (key.startsWith('supabase') || 
            key.includes('sb-') || 
            key.includes('auth') ||
            key.includes('token') ||
            key.includes('session') ||
            key.includes('user')) {
          console.log(`🗑️ Suppression sessionStorage: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
    }
    
    // Nettoyage supplémentaire des cookies
    try {
      console.log("🍪 Nettoyage des cookies...");
      document.cookie.split(";").forEach(function(c) { 
        const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
        if (cookieName.includes('supabase') || 
            cookieName.includes('sb-') || 
            cookieName.includes('auth') ||
            cookieName.includes('token')) {
          document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/"; 
          console.log(`🗑️ Cookie supprimé: ${cookieName}`);
        }
      });
    } catch (cookieError) {
      console.warn("Impossible de nettoyer les cookies:", cookieError);
    }
    
    console.log("✅ === NETTOYAGE D'ÉTAT TERMINÉ AVEC SUCCÈS === ✅");
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};

/**
 * Safe navigation to a URL with prevent of navigation loops
 * @param url The URL to navigate to
 */
export const safeNavigate = (url: string) => {
  console.log(`🚀 Navigation sécurisée vers: ${url}`);
  // Use window.location.replace for a full page refresh and no history entry
  window.location.replace(url);
};

/**
 * Fetch user profile from Supabase
 * @param userId The user ID to fetch the profile for
 * @param supabase The Supabase client instance
 * @returns The user profile data or null if not found/error
 */
export const fetchUserProfile = async (userId: string, supabase: any) => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    console.log("Profile fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in profile fetch:", error);
    return null;
  }
};
