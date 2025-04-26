
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { supabase } from "@/integrations/supabase/client";

/**
 * @protected
 * CETTE MÉTHODE EST PROTÉGÉE ET NE DOIT PAS ÊTRE MODIFIÉE.
 * This method is protected and must not be modified.
 * Version: 1.1.0
 * Last Modified: ${new Date().toISOString()}
 */
export const handlePDFGeneration = async (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void,
  isCard?: boolean
) => {
  try {
    console.log("[PDFGeneration] Starting PDF generation", isCard ? "as card" : "as full document");
    if (!profile) {
      console.error("[PDFGeneration] No profile data available");
      throw new Error("Les données du profil sont requises");
    }

    console.log("[PDFGeneration] Profile data:", profile);
    console.log("[PDFGeneration] Responses data:", responses);
    console.log("[PDFGeneration] Synthesis data:", responses.synthesis);

    // Variable pour suivre les tentatives
    let attempts = 0;
    const maxAttempts = 2;
    let pdfDataUrl: string | null = null;

    // Boucle de tentatives avec un délai entre chaque tentative
    while (attempts < maxAttempts && !pdfDataUrl) {
      try {
        console.log(`[PDFGeneration] Attempt ${attempts + 1} of ${maxAttempts}`);
        // Generate PDF - Pass the isCard parameter
        pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons, isCard);
        
        if (!pdfDataUrl) {
          console.error(`[PDFGeneration] PDF generation attempt ${attempts + 1} failed - no data URL returned`);
          
          // Si ce n'est pas la dernière tentative, attendez un peu avant de réessayer
          if (attempts < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (genError) {
        console.error(`[PDFGeneration] Error in generation attempt ${attempts + 1}:`, genError);
        
        // Si ce n'est pas la dernière tentative, attendez un peu avant de réessayer
        if (attempts < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      attempts++;
    }
    
    if (!pdfDataUrl) {
      throw new Error("La génération du PDF a échoué après plusieurs tentatives");
    }

    // Save PDF to storage if user is logged in
    if (profile.unique_identifier) {
      try {
        console.log("[PDFGeneration] Saving PDF to storage for user:", profile.unique_identifier);
        await savePDFToStorage(pdfDataUrl, profile.unique_identifier, isCard);
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
      description: isCard ? "Votre carte d'accès a été générée avec succès." : "Le PDF a été généré avec succès.",
    });
    
    return pdfDataUrl;
  } catch (error) {
    console.error("[PDFGeneration] Error generating PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * @protected
 * CETTE MÉTHODE EST PROTÉGÉE ET NE DOIT PAS ÊTRE MODIFIÉE.
 * This method is protected and must not be modified.
 * Version: 1.1.0
 * Last Modified: ${new Date().toISOString()}
 */
export const savePDFToStorage = async (pdfDataUrl: string, userId: string, isCard = false) => {
  try {
    // Convert data URL to Blob
    const response = await fetch(pdfDataUrl);
    const blob = await response.blob();
    
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();
    const filePrefix = isCard ? 'card_' : 'directives_';
    const filename = `${filePrefix}${timestamp}.pdf`;
    
    // Save cards in a separate folder
    const filepath = isCard 
      ? `${userId}/cards/${filename}`
      : `${userId}/${filename}`;
    
    console.log("[PDFStorage] Uploading PDF to storage path:", filepath);
    
    // Check if directives_pdfs bucket exists, if not create it
    const { data: bucketExists } = await supabase.storage.getBucket('directives_pdfs');
    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket('directives_pdfs', {
        public: false,
        fileSizeLimit: 5242880 // 5MB
      });
      if (bucketError) {
        console.error("[PDFStorage] Error creating bucket:", bucketError);
        throw bucketError;
      }
    }
    
    // Upload to storage with retry mechanism
    let uploadSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;
    let uploadError = null;
    let uploadData = null;
    
    while (!uploadSuccess && attempts < maxAttempts) {
      try {
        console.log(`[PDFStorage] Upload attempt ${attempts + 1} of ${maxAttempts}`);
        
        const { data, error } = await supabase
          .storage
          .from('directives_pdfs')
          .upload(filepath, blob, {
            contentType: 'application/pdf',
            upsert: attempts > 0 // Utiliser upsert pour les tentatives après la première
          });
          
        if (error) {
          console.error(`[PDFStorage] Error in upload attempt ${attempts + 1}:`, error);
          uploadError = error;
          // Attendre avant la prochaine tentative
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          uploadSuccess = true;
          uploadData = data;
          console.log("[PDFStorage] PDF uploaded successfully on attempt", attempts + 1);
        }
      } catch (err) {
        console.error(`[PDFStorage] Exception in upload attempt ${attempts + 1}:`, err);
        uploadError = err;
        // Attendre avant la prochaine tentative
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
    
    if (!uploadSuccess) {
      console.error("[PDFStorage] All upload attempts failed:", uploadError);
      throw uploadError;
    }
    
    console.log("[PDFStorage] PDF uploaded successfully:", uploadData);
    
    // Convert Date to ISO string for database compatibility
    const currentDate = new Date().toISOString();
    
    // Save reference in database with retry mechanism
    let dbSuccess = false;
    attempts = 0;
    let dbError = null;
    
    while (!dbSuccess && attempts < maxAttempts) {
      try {
        console.log(`[PDFStorage] Database insert attempt ${attempts + 1} of ${maxAttempts}`);
        
        const { error } = await supabase
          .from('pdf_documents')
          .insert({
            user_id: userId,
            file_name: filename,
            file_path: filepath,
            created_at: currentDate,
            content_type: 'application/pdf',
            description: isCard ? 'Carte d\'accès' : 'Directives anticipées générées'
          });
          
        if (error) {
          console.error(`[PDFStorage] Error in DB insert attempt ${attempts + 1}:`, error);
          dbError = error;
          // Attendre avant la prochaine tentative
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          dbSuccess = true;
          console.log("[PDFStorage] PDF reference saved to database on attempt", attempts + 1);
        }
      } catch (err) {
        console.error(`[PDFStorage] Exception in DB insert attempt ${attempts + 1}:`, err);
        dbError = err;
        // Attendre avant la prochaine tentative
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
    
    if (!dbSuccess) {
      console.error("[PDFStorage] All database insert attempts failed:", dbError);
      // On ne bloque pas le processus même si l'insertion dans la base échoue
      // car le fichier est déjà uploadé
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
