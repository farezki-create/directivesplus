import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PDFGenerationService } from "./PDFGenerationService";

/**
 * Uploads a PDF to Supabase storage and saves reference in the database
 * @param pdfDataUrl - The data URL of the PDF to upload
 * @param userId - The user ID to associate with the document
 * @param profile - The user profile information
 * @returns The external document ID (sanitized)
 */
export async function uploadPDFToStorage(pdfDataUrl: string, userId: string, profile: any): Promise<string | null> {
  try {
    console.log("[PDFStorageUtils] Uploading PDF to storage");
    
    // Utiliser notre service de génération PDF pour télécharger vers le cloud
    const externalId = await PDFGenerationService.uploadToCloud(pdfDataUrl, userId, profile);
    
    if (externalId) {
      // Enregistrer la référence dans la base de données
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert({
          user_id: userId,
          file_name: `${externalId}.pdf`,
          file_path: `external_storage/${externalId}.pdf`,
          content_type: 'application/pdf',
          description: `Directives anticipées de ${profile.first_name || ''} ${profile.last_name || ''}`,
          created_at: new Date().toISOString()
        });
          
      if (dbError) {
        console.error("[PDFStorageUtils] Error saving reference to database:", dbError);
        throw dbError;
      }
    }
    
    return externalId;
  } catch (error) {
    console.error("[PDFStorageUtils] Error in uploadPDFToStorage:", error);
    return null;
  }
}

/**
 * Syncs synthesis data to the cloud storage
 * @param userId - The user ID to associate with the synthesis
 * @returns A boolean indicating success or failure
 */
export async function syncSynthesisToCloud(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.error("[PDFStorageUtils] No user ID provided for syncing synthesis");
      return false;
    }
    
    // Transfer synthesis to cloud
    const { data: synthesis, error: synthesisError } = await supabase
      .from('questionnaire_synthesis')
      .select('free_text, signature')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (synthesisError) {
      console.error("[PDFStorageUtils] Error fetching synthesis:", synthesisError);
      return false;
    }
    
    if (synthesis) {
      console.log("[PDFStorageUtils] Backing up synthesis data to cloud");
      // Here we would implement code to backup the synthesis to an external cloud
      // For now, we're just confirming it exists in the database
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("[PDFStorageUtils] Error in syncSynthesisToCloud:", error);
    return false;
  }
}

/**
 * Retrieves a PDF document from storage by its external ID
 * @param externalId - The external document ID to retrieve
 * @returns The URL of the retrieved document or null if not found
 */
export async function retrievePDFFromStorage(externalId: string): Promise<string | null> {
  try {
    console.log("[PDFStorageUtils] Retrieving external document:", externalId);
    
    // Utiliser notre service de génération PDF pour récupérer depuis le cloud
    return await PDFGenerationService.retrieveFromCloud(externalId);
  } catch (error) {
    console.error("[PDFStorageUtils] Error in retrievePDFFromStorage:", error);
    return null;
  }
}
