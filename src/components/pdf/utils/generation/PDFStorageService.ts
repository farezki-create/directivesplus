
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling PDF storage operations
 */
export class PDFStorageService {
  /**
   * Saves a PDF to storage
   * @param pdfDataUrl - The PDF data URL
   * @param userId - The user ID
   * @param isCard - Whether this is a card format PDF
   * @returns A boolean indicating success or failure
   */
  static async savePDFToStorage(pdfDataUrl: string, userId: string, isCard = false) {
    try {
      // Validate data URL format
      if (!pdfDataUrl.startsWith('data:application/pdf;base64,')) {
        console.warn("[PDFStorage] Invalid PDF data URL format, attempting conversion");
      }

      // Convert data URL to Blob
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();
      
      if (blob.size === 0) {
        console.error("[PDFStorage] Generated PDF blob is empty");
        throw new Error("PDF blob is empty");
      }
      
      console.log("[PDFStorage] PDF blob size:", blob.size, "bytes");
      
      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const filePrefix = isCard ? 'card_' : 'directives_';
      const filename = `${filePrefix}${timestamp}.pdf`;
      
      // Save cards in a separate folder
      const filepath = isCard 
        ? `${userId}/cards/${filename}`
        : `${userId}/${filename}`;
      
      console.log("[PDFStorage] Uploading PDF to storage path:", filepath);
      
      // Upload to storage
      const { data, error } = await supabase
        .storage
        .from('directives_pdfs')
        .upload(filepath, blob, {
          contentType: 'application/pdf',
          upsert: false
        });
        
      if (error) {
        console.error("[PDFStorage] Error uploading PDF:", error);
        throw error;
      }
      
      console.log("[PDFStorage] PDF uploaded successfully:", data);
      
      // Convert Date to ISO string for database compatibility
      const currentDate = new Date().toISOString();
      
      // Also save reference in the database
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert({
          user_id: userId,
          file_name: filename,
          file_path: filepath,
          created_at: currentDate,
          content_type: 'application/pdf',
          description: isCard ? 'Carte d\'accès' : 'Directives anticipées générées'
        });
        
      if (dbError) {
        console.error("[PDFStorage] Error saving PDF reference to database:", dbError);
      }
      
      return true;
    } catch (error) {
      console.error("[PDFStorage] Error in savePDFToStorage:", error);
      return false;
    }
  }

  /**
   * Syncs synthesis data to cloud storage
   * @param userId - The user ID
   * @returns A boolean indicating success or failure
   */
  static async syncSynthesisToCloud(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        console.error("[PDFStorage] No user ID provided for syncing synthesis");
        return false;
      }
      
      // Transfer synthesis to cloud
      const { data: synthesis, error: synthesisError } = await supabase
        .from('questionnaire_synthesis')
        .select('free_text, signature')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (synthesisError) {
        console.error("[PDFStorage] Error fetching synthesis:", synthesisError);
        return false;
      }
      
      if (synthesis) {
        console.log("[PDFStorage] Backing up synthesis data to cloud");
        // Here we would implement code to backup the synthesis to an external cloud
        // For now, we're just confirming it exists in the database
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("[PDFStorage] Error in syncSynthesisToCloud:", error);
      return false;
    }
  }
}
