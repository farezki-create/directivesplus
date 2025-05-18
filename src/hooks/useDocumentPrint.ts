
import { toast } from "@/hooks/use-toast";
import { printDocument } from "@/utils/documentOperations";

export const useDocumentPrint = () => {
  const handlePrint = (filePath: string, fileType: string = "application/pdf") => {
    try {
      // Use the utility function from documentOperations.ts
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
