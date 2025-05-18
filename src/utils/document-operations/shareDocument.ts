
import { toast } from "@/hooks/use-toast";

/**
 * Shares a document using the provided document ID
 * Improved sharing functionality using Web Share API if available
 */
export const shareDocument = async (documentId: string) => {
  try {
    const shareUrl = `${window.location.origin}/partage-document/${documentId}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Partage de document DirectivesPlus",
          text: "Consultez ce document sur DirectivesPlus",
          url: shareUrl
        });
        
        toast({
          title: "Partage réussi",
          description: "Le document a été partagé avec succès"
        });
      } catch (error: any) {
        // Si l'utilisateur annule le partage ou si une autre erreur se produit
        console.error("Erreur lors du partage:", error);
        
        // On n'affiche pas d'erreur pour une annulation
        if (error.name !== "AbortError") {
          throw error; // Relancer l'erreur pour le bloc catch externe
        }
      }
    } else {
      // Fallback pour les navigateurs sans Web Share API
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans votre presse-papiers"
      });
    }
  } catch (error) {
    console.error("Erreur lors du partage du document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de partager le document. Vérifiez les permissions de votre navigateur.",
      variant: "destructive"
    });
  }
};
