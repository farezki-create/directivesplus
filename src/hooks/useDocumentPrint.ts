
import { toast } from "@/hooks/use-toast";
import { printDocument } from "@/utils/document-operations";
import { detectFileType } from "@/utils/documentUtils";

export const useDocumentPrint = () => {
  const handlePrint = (filePath: string, fileType: string = "") => {
    try {
      console.log("useDocumentPrint - handlePrint appelé pour:", filePath, fileType);
      
      // Si le fileType n'est pas spécifié, essayer de le détecter
      const actualFileType = fileType || detectFileType(filePath);
      console.log("useDocumentPrint - Type détecté:", actualFileType);
      
      // Use the printDocument utility function
      printDocument(filePath, actualFileType);
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
