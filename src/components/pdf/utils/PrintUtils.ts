
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
    // Open PDF directly in a new window
    const printWindow = window.open(pdfUrl, '_blank');
    if (!printWindow) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups ne sont pas bloqués.",
        variant: "destructive",
      });
      return false;
    }

    // Focus on the new window
    printWindow.focus();

    // Print after a short delay to ensure the PDF is loaded
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (error) {
        console.error("[PrintUtils] Error during print:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'impression",
          variant: "destructive",
        });
      }
    }, 1000);

    return true;
  } catch (error) {
    console.error("[PrintUtils] Error printing PDF:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'impression",
      variant: "destructive",
    });
    return false;
  }
};

