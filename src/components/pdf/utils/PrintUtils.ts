
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
    // Créer un élément d'ancrage pour télécharger le PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'directives-anticipees.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Information",
      description: "Le PDF a été téléchargé. Utilisez votre visionneuse PDF pour l'imprimer.",
    });
    
    return true;
  } catch (error) {
    console.error("[PrintUtils] Error downloading PDF:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors du téléchargement du document",
      variant: "destructive",
    });
    return false;
  }
};
