
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
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
    // SessionStorage may not be available
  }
};

export const performGlobalSignOut = async () => {
  try {
    cleanupAuthState();
    await supabase.auth.signOut({ scope: 'global' });
  } catch (error) {
    // Sign out error - state already cleaned
  }
};
