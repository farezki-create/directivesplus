
import { toast } from "@/hooks/use-toast";

export function handlePDFDownload(pdfUrl: string | null, customFilename?: string): void {
  if (!pdfUrl) {
    console.error("[PDFDownloader] No PDF URL available for download");
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
    return;
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
    
    console.log("[PDFDownloader] PDF downloaded successfully as:", filename);
    toast({
      title: "Téléchargement réussi",
      description: `Le fichier "${filename}" a été téléchargé dans votre dossier de téléchargements.`,
    });
  } catch (error) {
    console.error("[PDFDownloader] Error downloading PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
  }
}
