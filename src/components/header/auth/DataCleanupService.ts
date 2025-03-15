
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const cleanupUserData = async (userId: string) => {
  try {
    console.log("Starting data cleanup for user:", userId);
    
    // This array will track all cleanup operations
    const cleanupOperations = [
      // Step 1: Delete user signatures
      {
        name: "signatures",
        action: async () => {
          const { error } = await supabase
            .from("user_signatures")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      },
      
      // Step 2: Delete questionnaire synthesis
      {
        name: "synthesis",
        action: async () => {
          const { error } = await supabase
            .from("questionnaire_synthesis")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      },
      
      // Step 3: Delete questionnaire responses
      {
        name: "responses",
        action: async () => {
          const { error } = await supabase
            .from("questionnaire_responses")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      },
      
      // Step 4: Delete preferences responses
      {
        name: "preferences",
        action: async () => {
          const { error } = await supabase
            .from("questionnaire_preferences_responses")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      },
      
      // Step 5: Delete trusted persons
      {
        name: "trusted_persons",
        action: async () => {
          const { error } = await supabase
            .from("trusted_persons")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      },
      
      // Step 6: Delete PDF documents from database
      {
        name: "pdf_documents",
        action: async () => {
          const { error } = await supabase
            .from("pdf_documents")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      },
      
      // Step 7: Delete directives (last to maintain referential integrity)
      {
        name: "directives",
        action: async () => {
          const { error } = await supabase
            .from("directives")
            .delete()
            .eq("user_id", userId);
          return { error };
        }
      }
    ];
    
    // Execute all database cleanup operations
    for (const operation of cleanupOperations) {
      try {
        const { error } = await operation.action();
        if (error) {
          console.error(`Error deleting ${operation.name}:`, error);
        } else {
          console.log(`${operation.name} deleted successfully`);
        }
      } catch (operationError) {
        console.error(`Exception during ${operation.name} cleanup:`, operationError);
      }
    }
    
    // Handle storage cleanup separately due to its multi-step nature
    await cleanupStorage(userId);
    
    // Notify user of successful data deletion
    toast({
      title: "Suppression des données",
      description: "Vos données ont été supprimées avec succès.",
    });
    
    return { success: true };
  } catch (e) {
    console.error('Error during data cleanup:', e);
    return { success: false, error: e };
  }
};

const cleanupStorage = async (userId: string) => {
  try {
    // First, list all files in the user's folder
    const { data: storedFiles, error: listError } = await supabase
      .storage
      .from('directives_pdfs')
      .list(`${userId}`);

    if (listError) {
      console.error("Error listing PDF files in storage:", listError);
      return;
    }
    
    if (storedFiles && storedFiles.length > 0) {
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
  } catch (storageError) {
    console.error("Error during storage cleanup:", storageError);
  }
};
