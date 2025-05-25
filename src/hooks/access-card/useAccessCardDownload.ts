
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";

export const useAccessCardDownload = () => {
  const handleDownload = () => {
    const cardElement = document.getElementById('access-card');
    if (cardElement) {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Format carte bancaire
      });
      
      pdf.html(cardElement, {
        callback: function (doc) {
          doc.save('carte-acces-directives-anticipees.pdf');
          toast({
            title: "Téléchargement réussi",
            description: "La carte d'accès a été téléchargée en PDF"
          });
        },
        x: 0,
        y: 0,
        width: 85.6,
        windowWidth: 400
      });
    }
  };

  return {
    handleDownload
  };
};
