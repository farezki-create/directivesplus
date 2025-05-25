
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export const useAccessCard = () => {
  const { user, profile } = useAuth();
  const [codeAcces, setCodeAcces] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (user && profile) {
      // Générer un code d'accès institution basé sur l'ID utilisateur
      const generatedCode = `DA${user.id.substring(0, 8).toUpperCase()}`;
      setCodeAcces(generatedCode);
      
      // Créer l'URL pour le QR code qui pointe vers les directives
      const qrUrl = `${window.location.origin}/mes-directives?access=${generatedCode}`;
      setQrCodeUrl(qrUrl);
    }
  }, [user, profile]);

  const handlePrint = () => {
    // Masquer les éléments non imprimables
    const nonPrintElements = document.querySelectorAll('.print\\:hidden');
    nonPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
    
    // Style spécial pour l'impression
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        @page {
          size: 85.6mm 53.98mm;
          margin: 0;
        }
        body * {
          visibility: hidden;
        }
        #access-card, #access-card * {
          visibility: visible;
        }
        #access-card {
          position: absolute;
          left: 0;
          top: 0;
          width: 85.6mm !important;
          height: 53.98mm !important;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    
    window.print();
    
    // Restaurer l'affichage après impression
    setTimeout(() => {
      document.head.removeChild(printStyle);
      nonPrintElements.forEach(el => (el as HTMLElement).style.display = '');
    }, 1000);
    
    toast({
      title: "Impression lancée",
      description: "La carte d'accès va être imprimée au format carte de crédit"
    });
  };

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
    codeAcces,
    qrCodeUrl,
    handlePrint,
    handleDownload
  };
};
