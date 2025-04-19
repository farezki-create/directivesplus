
import { toast } from "@/hooks/use-toast";

export const printPDF = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    toast({
      title: "Erreur",
      description: "Aucun PDF à imprimer",
      variant: "destructive",
    });
    return false;
  }

  try {
    // Ouvrir dans un nouvel onglet pour impression
    const printWindow = window.open(pdfUrl, '_blank');
    
    if (printWindow) {
      // Attendre le chargement du PDF avant de lancer l'impression
      printWindow.onload = () => {
        try {
          printWindow.print();
        } catch (printError) {
          console.error("[PrintUtils] Error during print:", printError);
        }
      };
      
      // Fallback en cas d'échec du onload
      setTimeout(() => {
        try {
          if (!printWindow.closed) {
            printWindow.print();
          }
        } catch (timeoutError) {
          console.error("[PrintUtils] Error during delayed print:", timeoutError);
        }
      }, 1500);
    } else {
      // Si la fenêtre ne s'ouvre pas, téléchargeons simplement le PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Information",
        description: "Le PDF a été téléchargé (impossible d'ouvrir un nouvel onglet)",
      });
    }
    
    return true;
  } catch (error) {
    console.error("[PrintUtils] Error with PDF:", error);
    
    // En cas d'erreur, télécharger directement
    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Information",
        description: "Le PDF a été téléchargé suite à une erreur d'affichage",
      });
      
      return true;
    } catch (downloadError) {
      console.error("[PrintUtils] Error downloading PDF:", downloadError);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du document",
        variant: "destructive",
      });
      
      return false;
    }
  }
};
