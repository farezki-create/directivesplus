
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useSharedDocumentActions = () => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement commencé",
        description: `${fileName} est en cours de téléchargement`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handleView = (filePath: string) => {
    setPreviewDocument(filePath);
  };

  const handlePrint = (filePath: string) => {
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return {
    previewDocument,
    setPreviewDocument,
    handleDownload,
    handleView,
    handlePrint
  };
};
