
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
    // Créer une fenêtre temporaire pour l'impression
    const printWindow = window.open(pdfUrl, '_blank');
    
    if (!printWindow) {
      // Si le navigateur bloque l'ouverture, proposer le téléchargement
      downloadPDF(pdfUrl);
      return false;
    }
    
    // Attendre le chargement du PDF avant d'imprimer
    printWindow.onload = () => {
      setTimeout(() => {
        try {
          printWindow.print();
        } catch (printError) {
          console.error("[PrintUtils] Erreur pendant l'impression:", printError);
          // En cas d'erreur d'impression, garder la fenêtre ouverte pour permettre l'interaction manuelle
        }
      }, 1000); // Petit délai pour s'assurer que le contenu est bien chargé
    };
    
    return true;
  } catch (error) {
    console.error("[PrintUtils] Erreur avec le PDF:", error);
    
    // En cas d'erreur, tenter le téléchargement direct
    return downloadPDF(pdfUrl);
  }
};

// Fonction de téléchargement séparée pour la réutilisation
export const downloadPDF = (pdfUrl: string): boolean => {
  try {
    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'directives-anticipees.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Information",
      description: "Le PDF a été téléchargé",
    });
    
    return true;
  } catch (downloadError) {
    console.error("[PrintUtils] Erreur de téléchargement du PDF:", downloadError);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors du téléchargement du document",
      variant: "destructive",
    });
    
    return false;
  }
};
