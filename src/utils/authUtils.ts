
/**
 * Helper function to clean up Supabase auth state
 * Removes all auth-related localStorage and sessionStorage items
 */
export const cleanupAuthState = () => {
  console.log("🧹 Nettoyage complet et agressif de l'état d'authentification...");
  
  try {
    // Nettoyage BRUTAL de localStorage
    const localStorageKeys = Object.keys(localStorage);
    console.log(`Found ${localStorageKeys.length} localStorage keys`);
    
    localStorageKeys.forEach((key) => {
      if (key.startsWith('supabase.auth.') || 
          key.includes('sb-') || 
          key.startsWith('supabase-auth-token') ||
          key.includes('supabase') ||
          key.includes('auth') ||
          key.includes('token') ||
          key.includes('session')) {
        console.log(`🗑️ Suppression localStorage: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Nettoyage BRUTAL de sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const sessionStorageKeys = Object.keys(sessionStorage);
      console.log(`Found ${sessionStorageKeys.length} sessionStorage keys`);
      
      sessionStorageKeys.forEach((key) => {
        if (key.startsWith('supabase.auth.') || 
            key.includes('sb-') || 
            key.startsWith('supabase-auth-token') ||
            key.includes('supabase') ||
            key.includes('auth') ||
            key.includes('token') ||
            key.includes('session')) {
          console.log(`🗑️ Suppression sessionStorage: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
    }
    
    // Nettoyage supplémentaire des cookies si possible
    try {
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      console.log("🍪 Cookies nettoyés");
    } catch (cookieError) {
      console.warn("Impossible de nettoyer les cookies:", cookieError);
    }
    
    console.log("✅ Nettoyage d'état terminé avec succès");
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
  // Use window.location.href for a full page refresh to ensure clean state
  window.location.href = url;
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
