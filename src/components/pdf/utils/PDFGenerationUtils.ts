
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { supabase } from "@/integrations/supabase/client";

/**
 * @protected
 * CETTE MÉTHODE EST PROTÉGÉE ET NE DOIT PAS ÊTRE MODIFIÉE.
 * This method is protected and must not be modified.
 * Version: 1.0.0
 * Last Modified: ${new Date().toISOString()}
 */
export const handlePDFGeneration = async (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  try {
    console.log("[PDFGeneration] Starting PDF generation");
    if (!profile) {
      console.error("[PDFGeneration] No profile data available");
      throw new Error("Les données du profil sont requises");
    }

    console.log("[PDFGeneration] Profile data:", profile);
    console.log("[PDFGeneration] Responses data:", responses);
    console.log("[PDFGeneration] Synthesis data:", responses.synthesis);

    // Generate PDF
    const pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] PDF generation failed - no data URL returned");
      throw new Error("La génération du PDF a échoué");
    }

    // Save PDF to storage if user is logged in
    if (profile.unique_identifier) {
      try {
        console.log("[PDFGeneration] Saving PDF to storage for user:", profile.unique_identifier);
        await savePDFToStorage(pdfDataUrl, profile.unique_identifier);
      } catch (storageError) {
        console.error("[PDFGeneration] Error saving PDF to storage:", storageError);
        // Continue with preview even if storage fails
      }
    }

    setPdfUrl(pdfDataUrl);
    setShowPreview(true);

    console.log("[PDFGeneration] PDF generated successfully");
    toast({
      title: "Succès",
      description: "Le PDF a été généré avec succès.",
    });
  } catch (error) {
    console.error("[PDFGeneration] Error generating PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
      variant: "destructive",
    });
  }
};

/**
 * @protected
 * CETTE MÉTHODE EST PROTÉGÉE ET NE DOIT PAS ÊTRE MODIFIÉE.
 * This method is protected and must not be modified.
 * Version: 1.0.0
 * Last Modified: ${new Date().toISOString()}
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
        file_name: filename,
        file_path: filepath,
        created_at: currentDate,
        content_type: 'application/pdf',
        description: 'Directives anticipées générées'
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
 * Télécharge le PDF avec un nom de fichier personnalisé
 * Cette méthode peut être modifiée selon les besoins
 */
export const handlePDFDownload = (pdfUrl: string | null, customFilename?: string) => {
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
    // Créer un nom de fichier formaté avec la date
    const now = new Date();
    const dateFormatted = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    
    // Utiliser le nom personnalisé ou un nom par défaut avec date
    const filename = customFilename || `directives-anticipees_${dateFormatted}.pdf`;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("[PDFGeneration] PDF downloaded successfully as:", filename);
    toast({
      title: "Téléchargement réussi",
      description: `Le fichier "${filename}" a été téléchargé dans votre dossier de téléchargements.`,
    });
  } catch (error) {
    console.error("[PDFGeneration] Error downloading PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
  }
};
