
import { supabase } from "@/integrations/supabase/client";

// Interface for PDF storage data
export interface PdfStorageData {
  userId: string;
  pdfOutput: string | null;
  description: string;
}

// Save PDF document to the database
export const savePdfToDatabase = async (
  data: PdfStorageData
): Promise<any> => {
  try {
    // Validate pdfOutput before proceeding
    if (!data.pdfOutput) {
      throw new Error("Aucune donnée PDF disponible");
    }
    
    // Make sure userId is valid
    if (!data.userId) {
      throw new Error("ID utilisateur manquant");
    }
    
    const fileName = `directives-anticipees-${new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')}.pdf`;
    
    const currentDateString = new Date().toISOString();
    
    const pdfRecord = {
      user_id: data.userId,
      file_name: fileName,
      file_path: data.pdfOutput, // Stocke le PDF comme data URI
      content_type: "application/pdf",
      file_size: Math.floor((data.pdfOutput.length || 0) / 1.33), // Estimation approximative de la taille
      description: data.description || "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      created_at: currentDateString
    };
    
    const { data: insertedData, error } = await supabase
      .from('pdf_documents')
      .insert(pdfRecord)
      .select();
    
    if (error) {
      console.error("Erreur lors de l'enregistrement du PDF:", error);
      throw error;
    }
    
    return insertedData;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du PDF:", error);
    throw error;
  }
};
