
import { uploadPDFToStorage } from './PDFUploader';
import { toast } from "@/hooks/use-toast";

/**
 * Saves a PDF to storage with proper error handling
 */
export async function savePDFToStorage(
  pdfUrl: string, 
  userId: string, 
  isCard: boolean = false
): Promise<string | null> {
  try {
    if (!userId) {
      console.error("[PDFStorageSaver] No user ID provided");
      toast({
        title: "Erreur",
        description: "Utilisateur non connecté.",
        variant: "destructive",
      });
      return null;
    }

    // Get profile data
    const { profile } = await import('@/components/pdf/usePDFData').then(m => m.usePDFData());
    
    if (!profile) {
      console.error("[PDFStorageSaver] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      return null;
    }

    console.log("[PDFStorageSaver] Saving PDF with metadata", {
      userId,
      firstName: profile.first_name,
      lastName: profile.last_name,
      isCard
    });

    // Upload to storage
    const documentId = await uploadPDFToStorage(pdfUrl, userId, profile);
    
    if (!documentId) {
      console.error("[PDFStorageSaver] Failed to upload PDF");
      return null;
    }
    
    console.log("[PDFStorageSaver] PDF saved successfully with ID:", documentId);
    return documentId;
  } catch (error) {
    console.error("[PDFStorageSaver] Error saving PDF:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la sauvegarde du document.",
      variant: "destructive",
    });
    return null;
  }
}
