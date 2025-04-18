
import { cleanupPDFData } from "./storage/pdf-cleanup";
import { cleanupCacheData } from "./storage/cache-cleanup";

/**
 * Cleans up local storage data while preserving HDS data on server
 */
export const cleanupLocalStorage = (): void => {
  try {
    console.log("Clearing local storage data");
    
    // Clean up PDF data and blob URLs
    cleanupPDFData();
    
    // Clean up cached responses
    cleanupCacheData();
    
    // Clean up any session-specific data that might be lingering
    const sessionKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase.auth') || 
      key.includes('session') ||
      key.includes('token')
    );
    
    sessionKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed session data: ${key}`);
    });
    
    console.log('Local storage cleanup completed');
  } catch (e) {
    console.error('Error during local storage cleanup:', e);
  }
};
