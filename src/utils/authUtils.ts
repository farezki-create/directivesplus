
/**
 * Helper function to clean up Supabase auth state
 * Removes all auth-related localStorage and sessionStorage items
 */
export const cleanupAuthState = () => {
  console.log("Cleaning up auth state...");
  
  // Clean localStorage items
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Clean sessionStorage items if available
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`Removing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
  }
};

/**
 * Safe navigation to a URL with prevent of navigation loops
 * @param url The URL to navigate to
 */
export const safeNavigate = (url: string) => {
  console.log(`Safe navigating to: ${url}`);
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
