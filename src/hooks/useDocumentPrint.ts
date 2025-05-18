
import { toast } from "@/hooks/use-toast";
import { printDocument } from "@/utils/document-operations";

export const useDocumentPrint = () => {
  const handlePrint = (filePath: string, fileType: string = "application/pdf") => {
    try {
      console.log("useDocumentPrint - handlePrint appelé pour:", filePath, fileType);
      
      // Use the printDocument utility function
      printDocument(filePath, fileType);
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document. Vérifiez que les popups sont autorisés.",
        variant: "destructive"
      });
    }
  };

  return { handlePrint };
};
