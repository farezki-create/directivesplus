
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCardDownload() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCardPdf = async (pdfUrl: string, fileName: string = 'carte-directives-anticipees.pdf') => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible pour téléchargement",
        variant: "destructive"
      });
      return false;
    }

    setIsDownloading(true);
    
    try {
      // Force le téléchargement par fetch puis blob pour garantir un PDF valide
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error("Échec de récupération du PDF");
      }
      
      const blob = await response.blob();
      
      // Créer un nouvel URL de blob avec le type MIME approprié
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(pdfBlob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer l'URL après téléchargement
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
      toast({
        title: "Téléchargement démarré",
        description: `Le fichier ${fileName} est en cours de téléchargement`
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadCardPdf,
    isDownloading
  };
}
