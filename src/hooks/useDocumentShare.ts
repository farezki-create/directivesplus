
import { toast } from "@/hooks/use-toast";
import { shareDocument } from "@/utils/document-operations";

export const useDocumentShare = () => {
  const handleShare = (documentId: string) => {
    try {
      // Use the shareDocument utility function
      shareDocument(documentId);
    } catch (error) {
      console.error("Erreur lors du partage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager le document",
        variant: "destructive"
      });
    }
  };

  return { handleShare };
};
