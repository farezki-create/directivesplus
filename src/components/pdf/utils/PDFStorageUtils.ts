
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles saving PDF to Supabase storage
 */
export const savePDFToStorage = async (pdfDataUrl: string, userId: string) => {
  try {
    // Convert data URL to Blob
    const response = await fetch(pdfDataUrl);
    const blob = await response.blob();
    
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `directives_${timestamp}.pdf`;
    const filepath = `${userId}/${filename}`;
    
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
        storage_path: filepath,
        file_name: filename,
        created_at: currentDate, // Now using string format (ISO)
        file_path: filepath
      });
      
    if (dbError) {
      console.error("[PDFStorage] Error saving PDF reference to database:", dbError);
    }
    
    return true;
  } catch (error) {
    console.error("[PDFStorage] Error in savePDFToStorage:", error);
    return false;
  }
};

/**
 * Handles downloading a PDF
 */
export const handlePDFDownload = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    console.error("[PDFGeneration] No PDF URL available for download");
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'directives-anticipees.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("[PDFGeneration] PDF downloaded successfully");
  } catch (error) {
    console.error("[PDFGeneration] Error downloading PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
  }
};
