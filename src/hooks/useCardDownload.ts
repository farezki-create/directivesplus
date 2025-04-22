
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCardDownload() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const downloadCardPdf = async (cardPdfUrl: string, fileName: string): Promise<boolean> => {
    setIsDownloading(true);
    setDownloadError(null);
    setHasError(false);

    try {
      const response = await fetch(cardPdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Carte téléchargée",
        description: "Le téléchargement de votre carte a été effectué avec succès",
      });

      return true;
    } catch (error) {
      console.error("[useCardDownload] Error downloading card:", error);
      setDownloadError(`Erreur lors du téléchargement: ${(error as Error).message}`);
      setHasError(true);
      
      toast({
        title: "Erreur",
        description: "Le téléchargement a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadCardPdf,
    isDownloading,
    downloadError,
    hasError
  };
}
