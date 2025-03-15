
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
    console.log("[PDFGeneration] Responses data available:", !!responses);

    // Generate PDF
    const pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] PDF generation failed - no data URL returned");
      throw new Error("La génération du PDF a échoué");
    }

    console.log("[PDFGeneration] PDF generated successfully, data URL length:", pdfDataUrl.length);
    console.log("[PDFGeneration] PDF data URL starts with:", pdfDataUrl.substring(0, 50) + "...");

    // Save PDF to storage if user is logged in and storage bucket exists
    if (profile.unique_identifier) {
      try {
        // Vérifier d'abord si le bucket existe
        const { data: buckets, error: bucketError } = await supabase
          .storage
          .listBuckets();
          
        if (bucketError) {
          console.error("[PDFStorage] Error checking buckets:", bucketError);
        } else {
          const bucketExists = buckets?.some(bucket => bucket.name === 'directives_pdfs');
          
          if (bucketExists) {
            console.log("[PDFGeneration] Attempting to save PDF to storage for user:", profile.unique_identifier);
            await savePDFToStorage(pdfDataUrl, profile.unique_identifier);
          } else {
            console.warn("[PDFStorage] Storage bucket 'directives_pdfs' does not exist, skipping storage");
          }
        }
      } catch (storageError) {
        console.error("[PDFGeneration] Error saving PDF to storage:", storageError);
        // Ne pas bloquer le flux - continuer avec l'aperçu même si le stockage échoue
      }
    }

    // Store the PDF URL in localStorage as a backup
    try {
      localStorage.setItem(`pdf_${profile.unique_identifier}`, pdfDataUrl);
      console.log("[PDFGeneration] PDF URL saved to localStorage");
    } catch (localStorageError) {
      console.error("[PDFGeneration] Error saving to localStorage:", localStorageError);
      // Continue even if localStorage fails
    }

    // Set the PDF URL and show preview
    setPdfUrl(pdfDataUrl);
    setShowPreview(true);

    console.log("[PDFGeneration] PDF generation and display successful");
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
    // Ensure we call setPdfUrl with null to indicate failure
    setPdfUrl(null);
  }
};

export const savePDFToStorage = async (pdfDataUrl: string, userId: string) => {
  try {
    // Vérifier d'abord si le bucket existe
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketError) {
      console.error("[PDFStorage] Error checking buckets:", bucketError);
      return false;
    }
      
    const bucketExists = buckets?.some(bucket => bucket.name === 'directives_pdfs');
    
    if (!bucketExists) {
      console.warn("[PDFStorage] Storage bucket 'directives_pdfs' does not exist");
      return false;
    }
    
    try {
      // Convert data URL to Blob
      const response = await fetch(pdfDataUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF data: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error("PDF blob is empty");
      }
      
      console.log("[PDFStorage] PDF blob created successfully, size:", blob.size);
      
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
          created_at: currentDate,
          file_path: filepath
        });
        
      if (dbError) {
        console.error("[PDFStorage] Error saving PDF reference to database:", dbError);
      }
      
      return true;
    } catch (conversionError) {
      console.error("[PDFStorage] Error converting or uploading PDF:", conversionError);
      return false;
    }
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
    console.log("[PDFGeneration] Starting PDF download, URL type:", typeof pdfUrl);
    console.log("[PDFGeneration] PDF URL length:", pdfUrl.length);
    
    // Verify URL is a valid data URL
    if (typeof pdfUrl !== 'string' || pdfUrl.trim() === '') {
      console.error("[PDFGeneration] Invalid PDF URL format: empty or not a string");
      toast({
        title: "Erreur",
        description: "Format de PDF invalide.",
        variant: "destructive",
      });
      return;
    }
    
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
