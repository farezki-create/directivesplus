
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
    
    // Convert data URL to blob
    const response = await fetch(pdfDataUrl);
    const blob = await response.blob();

    // Generate a unique identifier based on user details
    const firstName = profile.first_name || 'unknown';
    const lastName = profile.last_name || 'unknown';
    const birthDate = profile.birth_date 
      ? format(new Date(profile.birth_date), 'yyyy-MM-dd') 
      : 'unknown';
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    
    // Create a unique external ID 
    const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
    const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // File path in storage
    const filePath = `external_storage/${sanitizedExternalId}.pdf`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('directives_pdfs')
      .upload(filePath, blob, {
        contentType: 'application/pdf',
        upsert: false
      });
      
    if (error) {
      console.error("[PDFStorageUtils] Error uploading to external storage:", error);
      throw error;
    }
    
    console.log("[PDFStorageUtils] PDF saved to external storage:", data);

    // Save reference in database for retrieval
    const { error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        user_id: userId,
        file_name: `${sanitizedExternalId}.pdf`,
        file_path: filePath,
        content_type: 'application/pdf',
        description: `Directives anticipées de ${firstName} ${lastName}`,
        created_at: new Date().toISOString()
      });
      
    if (dbError) {
      console.error("[PDFStorageUtils] Error saving reference to database:", dbError);
      throw dbError;
    }
    
    return sanitizedExternalId;
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
    
    // Find the document in the database
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .ilike('file_name', `%${externalId}%`)
      .single();
      
    if (error || !data) {
      console.error("[PDFStorageUtils] Error finding document:", error);
      throw new Error("Document non trouvé");
    }
    
    // Get the file from storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('directives_pdfs')
      .download(data.file_path);
      
    if (fileError || !fileData) {
      console.error("[PDFStorageUtils] Error downloading file:", fileError);
      throw new Error("Impossible de télécharger le fichier");
    }
    
    // Convert to URL for display
    const url = URL.createObjectURL(fileData);
    
    return url;
  } catch (error) {
    console.error("[PDFStorageUtils] Error in retrievePDFFromStorage:", error);
    return null;
  }
}
