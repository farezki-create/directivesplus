
import { toast } from "@/hooks/use-toast";

/**
 * Cleans up PDF-related data from local storage and revokes blob URLs
 */
export const cleanupPDFData = (): void => {
  try {
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
  } catch (e) {
    console.error('Error during PDF cleanup:', e);
  }
};
