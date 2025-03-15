
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { supabase } from "@/integrations/supabase/client";

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
    console.log("[PDFGeneration] Responses data:", responses ? "Available" : "Not available");

    // Generate PDF
    const pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] PDF generation failed - no data URL returned");
      throw new Error("La génération du PDF a échoué");
    }
    
    console.log("[PDFGeneration] PDF generated successfully, data URL length:", pdfDataUrl.length);

    // Clean the URL to ensure consistent format
    const cleanPdfUrl = pdfDataUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
    
    // Backup to localStorage regardless of storage upload success
    try {
      if (profile.unique_identifier) {
        localStorage.setItem(`pdf_${profile.unique_identifier}`, cleanPdfUrl);
        console.log("[PDFGeneration] PDF URL saved to localStorage as backup");
      }
    } catch (storageError) {
      console.warn("[PDFGeneration] Unable to save PDF to localStorage:", storageError);
    }

    // Save PDF to storage if user is logged in
    if (profile.unique_identifier) {
      try {
        // First, check if the bucket exists
        const { data: buckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();
          
        console.log("[PDFGeneration] Available buckets:", buckets?.map(b => b.name));
        
        if (bucketsError) {
          console.error("[PDFGeneration] Error checking buckets:", bucketsError);
          // We'll continue with the local PDF regardless of bucket availability
        } else {
          // If the directives_pdfs bucket exists, proceed with upload
          const directivesBucketExists = buckets?.some(b => b.name === 'directives_pdfs');
          
          if (directivesBucketExists) {
            console.log("[PDFGeneration] directives_pdfs bucket found, attempting storage");
            await savePDFToStorage(cleanPdfUrl, profile.unique_identifier);
          } else {
            console.warn("[PDFGeneration] directives_pdfs bucket not found, using local PDF only");
          }
        }
      } catch (storageError) {
        console.error("[PDFGeneration] Error with storage operations:", storageError);
        // Continue with preview even if storage fails
      }
    }

    setPdfUrl(cleanPdfUrl);
    setShowPreview(true);

    console.log("[PDFGeneration] PDF preview ready to display");
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
    
    // Reset the UI state
    setPdfUrl(null);
    setShowPreview(false);
  }
};

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
    console.log("[PDFGeneration] Starting download with URL type:", typeof pdfUrl);
    console.log("[PDFGeneration] URL starts with:", pdfUrl.substring(0, 30));
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'directives-anticipees.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("[PDFGeneration] PDF download initiated");
    
    toast({
      title: "Téléchargement",
      description: "Le téléchargement du PDF a commencé.",
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
