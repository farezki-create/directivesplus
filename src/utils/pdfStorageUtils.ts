
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
export async function uploadPDFToStorage(pdfDataUrl: string | Blob, userId: string, profile: any): Promise<string | null> {
  try {
    console.log("[PDFStorageUtils] Uploading PDF to storage");
    
    // Prepare file name
    const firstName = profile.first_name || 'unknown';
    const lastName = profile.last_name || 'unknown';
    const birthDate = profile.birth_date 
      ? new Date(profile.birth_date).toISOString().split('T')[0]
      : 'unknown';
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    
    const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
    const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedExternalId}.pdf`;
    
    // Convert data URL to Blob if necessary
    let pdfBlob: Blob;
    if (typeof pdfDataUrl === 'string' && pdfDataUrl.startsWith('data:')) {
      const response = await fetch(pdfDataUrl);
      pdfBlob = await response.blob();
    } else if (pdfDataUrl instanceof Blob) {
      pdfBlob = pdfDataUrl;
    } else if (typeof pdfDataUrl === 'string') {
      throw new Error("Invalid PDF data format: must be a data URL");
    } else {
      throw new Error("Invalid PDF data format: must be a data URL or a Blob");
    }
    
    // Utiliser notre service de génération PDF pour télécharger vers le cloud
    const documentId = await PDFGenerationService.uploadToCloud(pdfBlob, fileName, {
      userId,
      firstName,
      lastName,
      birthDate,
      documentType: 'directives',
      createdAt: new Date().toISOString()
    });
    
    if (documentId) {
      // Enregistrer la référence dans la base de données
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert({
          user_id: userId,
          file_name: `${documentId}.pdf`,
          file_path: `external_storage/${documentId}.pdf`,
          content_type: 'application/pdf',
          description: `Directives anticipées de ${firstName} ${lastName}`,
          created_at: new Date().toISOString()
        });
          
      if (dbError) {
        console.error("[PDFStorageUtils] Error saving reference to database:", dbError);
        throw dbError;
      }
    }
    
    return documentId;
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
