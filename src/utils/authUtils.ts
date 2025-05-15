
/**
 * Helper function to clean up Supabase auth state
 * Removes all auth-related localStorage items
 */
export const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};
