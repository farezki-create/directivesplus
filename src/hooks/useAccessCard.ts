
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";

export const useAccessCard = () => {
  const { user, profile } = useAuth();
  const [codeAcces, setCodeAcces] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateQRCodeForDirectives = async () => {
      if (user && profile) {
        // Générer un code d'accès institution basé sur l'ID utilisateur
        const generatedCode = `DA${user.id.substring(0, 8).toUpperCase()}`;
        setCodeAcces(generatedCode);
        
        try {
          // Récupérer le document de directives anticipées de l'utilisateur
          const { data: documents, error } = await supabase
            .from('documents')
            .select('id, file_name')
            .eq('user_id', user.id)
            .eq('document_type', 'directive')
            .order('created_at', { ascending: false })
            .limit(1);

          if (error) {
            console.error("Erreur lors de la récupération du document:", error);
            // Fallback vers l'URL d'accès institution
            const fallbackUrl = `${window.location.origin}/institution-access?code=${generatedCode}`;
            setQrCodeUrl(fallbackUrl);
            return;
          }

          if (documents && documents.length > 0) {
            // Utiliser l'URL de partage direct du document
            const directShareUrl = `${window.location.origin}/pdf-viewer?id=${documents[0].id}`;
            setQrCodeUrl(directShareUrl);
            console.log("QR Code généré pour le document:", documents[0].file_name, "URL:", directShareUrl);
          } else {
            // Aucun document trouvé, utiliser l'URL d'accès institution
            const fallbackUrl = `${window.location.origin}/institution-access?code=${generatedCode}`;
            setQrCodeUrl(fallbackUrl);
            console.log("Aucun document de directives trouvé, utilisation de l'URL d'accès institution");
          }
        } catch (err) {
          console.error("Erreur lors de la génération du QR code:", err);
          // Fallback vers l'URL d'accès institution
          const fallbackUrl = `${window.location.origin}/institution-access?code=${generatedCode}`;
          setQrCodeUrl(fallbackUrl);
        }
      }
    };

    generateQRCodeForDirectives();
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
