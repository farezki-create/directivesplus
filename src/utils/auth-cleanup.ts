
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Cleans up local storage data
 */
export const cleanupLocalStorage = (): void => {
  try {
    console.log("Clearing local storage data");
    
    // Clear PDF data
    const pdfUrls = Object.keys(localStorage).filter(key => 
      key.startsWith('pdf_') || key.includes('dataurlstring')
    );
    
    pdfUrls.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed localStorage item: ${key}`);
    });
    
    // Revoke object URLs
    if (window.URL && window.URL.revokeObjectURL) {
      pdfUrls.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith('blob:')) {
            window.URL.revokeObjectURL(value);
            console.log(`Revoked object URL for: ${key}`);
          }
        } catch (e) {
          console.error('Error revoking object URL:', e);
        }
      });
    }
    
    // Clear any response data cached in localStorage
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('response') || 
      key.includes('directive') || 
      key.includes('synthesis') ||
      key.includes('profile')
    );
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed cached data: ${key}`);
    });
    
    console.log('Local storage cleanup completed');
  } catch (e) {
    console.error('Error during local storage cleanup:', e);
  }
};
