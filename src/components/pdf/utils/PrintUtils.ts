
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
    // Ouvrir le PDF dans un nouvel onglet et laisser l'utilisateur imprimer manuellement
    const newWindow = window.open(pdfUrl, '_blank');
    
    if (!newWindow) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document. Vérifiez que les popups ne sont pas bloqués.",
        variant: "destructive",
      });
      return false;
    }
    
    // Mettre le focus sur la nouvelle fenêtre
    newWindow.focus();
    
    toast({
      title: "Information",
      description: "Utilisez l'onglet 'Imprimer' du navigateur pour imprimer le document",
    });
    
    return true;
  } catch (error) {
    console.error("[PrintUtils] Error opening PDF:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'ouverture du document",
      variant: "destructive",
    });
    return false;
  }
};
