
import { toast } from "@/hooks/use-toast";

/**
 * Service for handling PDF download operations
 */
export class PDFDownloadService {
  /**
   * Downloads a PDF with a custom filename
   * @param pdfUrl - The PDF URL to download
   * @param customFilename - Optional custom filename
   * @returns A boolean indicating success or failure
   */
  static downloadPDF(pdfUrl: string | null, customFilename?: string): boolean {
    if (!pdfUrl) {
      console.error("[PDFGeneration] No PDF URL available for download");
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le PDF.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Créer un nom de fichier formaté avec la date
      const now = new Date();
      const dateFormatted = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      
      // Utiliser le nom personnalisé ou un nom par défaut avec date
      const filename = customFilename || `directives-anticipees_${dateFormatted}.pdf`;
      
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("[PDFGeneration] PDF downloaded successfully as:", filename);
      toast({
        title: "Téléchargement réussi",
        description: `Le fichier "${filename}" a été téléchargé dans votre dossier de téléchargements.`,
      });
      
      return true;
    } catch (error) {
      console.error("[PDFGeneration] Error downloading PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le PDF.",
        variant: "destructive",
      });
      return false;
    }
  }
}
