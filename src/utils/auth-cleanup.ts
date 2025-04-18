
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";

/**
 * Handles cleanup of all user data when signing out
 * @param userId The ID of the user to clean up data for
 */
export const cleanupUserData = async (userId: string): Promise<boolean> => {
  try {
    console.log("Starting logout cleanup for user:", userId);
    
    // Step 1: Delete user signatures
    const { error: signatureError } = await supabase
      .from("user_signatures")
      .delete()
      .eq("user_id", userId);
      
    if (signatureError) {
      console.error("Error deleting signatures:", signatureError);
    } else {
      console.log("User signatures deleted successfully");
    }
    
    // Step 2: Delete questionnaire synthesis
    const { error: synthesisError } = await supabase
      .from("questionnaire_synthesis")
      .delete()
      .eq("user_id", userId);
      
    if (synthesisError) {
      console.error("Error deleting synthesis:", synthesisError);
    } else {
      console.log("Questionnaire synthesis deleted successfully");
    }
    
    // Step 3: Delete questionnaire responses
    const { error: responsesError } = await supabase
      .from("questionnaire_responses")
      .delete()
      .eq("user_id", userId);
      
    if (responsesError) {
      console.error("Error deleting questionnaire responses:", responsesError);
    } else {
      console.log("Questionnaire responses deleted successfully");
    }
    
    // Step 4: Delete preferences responses
    const { error: preferencesError } = await supabase
      .from("questionnaire_preferences_responses")
      .delete()
      .eq("user_id", userId);
      
    if (preferencesError) {
      console.error("Error deleting preferences responses:", preferencesError);
    } else {
      console.log("Preferences responses deleted successfully");
    }
    
    // Step 5: Delete trusted persons
    const { error: trustedPersonsError } = await supabase
      .from("trusted_persons")
      .delete()
      .eq("user_id", userId);
      
    if (trustedPersonsError) {
      console.error("Error deleting trusted persons:", trustedPersonsError);
    } else {
      console.log("Trusted persons deleted successfully");
    }
    
    // Step 6: Delete any PDF documents from database
    const { error: pdfError } = await supabase
      .from("pdf_documents")
      .delete()
      .eq("user_id", userId);
      
    if (pdfError) {
      console.error("Error deleting PDF documents from database:", pdfError);
    } else {
      console.log("PDF documents deleted from database successfully");
    }

    // Step 7: Delete files from Scalingo HDS storage
    await cleanupScalingoHDSFiles(userId);
    
    // Step 8: Delete any PDF files from storage
    await cleanupStorageFiles(userId);
    
    // Step 9: Delete directives (ensure it runs last to maintain referential integrity)
    const { error: directivesError } = await supabase
      .from("directives")
      .delete()
      .eq("user_id", userId);
      
    if (directivesError) {
      console.error("Error deleting directives:", directivesError);
    } else {
      console.log("Directives deleted successfully");
    }
    
    // Notify user of data deletion
    toast({
      title: "Suppression des données",
      description: "Vos données ont été supprimées avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error("Error during data cleanup:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la suppression de vos données.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Clean up files stored in Scalingo HDS
 */
const cleanupScalingoHDSFiles = async (userId: string): Promise<void> => {
  try {
    console.log("Starting Scalingo HDS cleanup for user:", userId);
    
    // Initialize Scalingo HDS provider
    const scalingoProvider = new ScalingoHDSStorageProvider();
    
    // Delete all user files from Scalingo HDS
    const result = await scalingoProvider.deleteUserFiles(userId);
    
    if (result) {
      console.log("All user files successfully deleted from Scalingo HDS");
    } else {
      console.error("Failed to delete some files from Scalingo HDS");
    }
  } catch (error) {
    console.error("Error during Scalingo HDS cleanup:", error);
  }
};

/**
 * Cleans up storage files for a user
 */
const cleanupStorageFiles = async (userId: string): Promise<void> => {
  try {
    // First, list all files in the user's folder
    const { data: storedFiles, error: listError } = await supabase
      .storage
      .from('directives_pdfs')
      .list(`${userId}`);

    if (listError) {
      console.error("Error listing PDF files in storage:", listError);
    } else if (storedFiles && storedFiles.length > 0) {
      console.log(`Found ${storedFiles.length} PDF files to delete:`, storedFiles);
      
      // Delete each file
      const fileNames = storedFiles.map(file => `${userId}/${file.name}`);
      const { data: removedData, error: removeError } = await supabase
        .storage
        .from('directives_pdfs')
        .remove(fileNames);
        
      if (removeError) {
        console.error("Error deleting PDF files from storage:", removeError);
      } else {
        console.log("PDF files removed from storage successfully:", removedData);
      }
    } else {
      console.log("No PDF files found in storage for this user");
    }
    
    // Also try to empty the user's folder itself
    const { error: folderError } = await supabase
      .storage
      .from('directives_pdfs')
      .remove([`${userId}`]);
      
    if (folderError && !folderError.message.includes("not found")) {
      console.error("Error removing user folder:", folderError);
    } else {
      console.log("User folder removed or was already empty");
    }
  } catch (error) {
    console.error("Error during storage cleanup:", error);
  }
};

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
    
    // Additional cleanup for any blob URLs or PDF data
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        // Check if this item contains PDF-related data
        if (value && (
          value.includes('data:application/pdf') || 
          value.includes('JVBERi0') || // PDF header in base64
          key.includes('pdf') ||
          key.includes('PDF')
        )) {
          localStorage.removeItem(key);
          console.log(`Removed PDF-related data: ${key}`);
        }
      } catch (e) {
        console.error(`Error processing localStorage item ${key}:`, e);
      }
    });
    
    console.log('Local storage cleanup completed');
  } catch (e) {
    console.error('Error during local storage cleanup:', e);
  }
};
