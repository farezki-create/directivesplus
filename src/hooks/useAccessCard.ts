
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
    if (user && profile) {
      // Générer un code d'accès institution basé sur l'ID utilisateur
      const generatedCode = `DA${user.id.substring(0, 8).toUpperCase()}`;
      setCodeAcces(generatedCode);
      
      // Récupérer le document des directives anticipées pour le QR code
      fetchDirectivesDocument(user.id);
    }
  }, [user, profile]);

  const fetchDirectivesDocument = async (userId: string) => {
    try {
      const { data: documents, error } = await supabase
        .from('pdf_documents')
        .select('id, file_name')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erreur lors de la récupération du document:", error);
        // Fallback vers l'URL d'accès direct si pas de document
        const fallbackUrl = `${window.location.origin}/direct-document?id=${userId}`;
        setQrCodeUrl(fallbackUrl);
        return;
      }

      if (documents && documents.length > 0) {
        // QR code pointant vers le document des directives anticipées
        const directiveUrl = `${window.location.origin}/direct-document?id=${documents[0].id}`;
        setQrCodeUrl(directiveUrl);
      } else {
        // Fallback vers l'URL d'accès direct si pas de document
        const fallbackUrl = `${window.location.origin}/direct-document?id=${userId}`;
        setQrCodeUrl(fallbackUrl);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      // Fallback vers l'URL d'accès direct
      const fallbackUrl = `${window.location.origin}/direct-document?id=${userId}`;
      setQrCodeUrl(fallbackUrl);
    }
  };

  const handlePrint = () => {
    // Créer un style spécialement optimisé pour l'impression
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        @page {
          size: 85.6mm 53.98mm;
          margin: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: white !important;
        }
        
        body * {
          visibility: hidden;
        }
        
        #access-card, #access-card * {
          visibility: visible;
        }
        
        #access-card {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 85.6mm !important;
          height: 53.98mm !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          border-radius: 8px !important;
          background: linear-gradient(135deg, #4338ca, #312e81) !important;
          color: white !important;
          font-size: 3mm !important;
          box-sizing: border-box !important;
        }
        
        #access-card .absolute {
          position: absolute !important;
        }
        
        #access-card .relative {
          position: relative !important;
        }
        
        /* Masquer les éléments non essentiels pour l'impression */
        .print\\:hidden {
          display: none !important;
        }
        
        /* Assurer que le QR code reste visible */
        #access-card svg {
          width: 28mm !important;
          height: 28mm !important;
        }
        
        /* Ajuster la taille des textes */
        #access-card h1, #access-card h2, #access-card h3 {
          font-size: 4mm !important;
          line-height: 1.2 !important;
        }
        
        #access-card p, #access-card div {
          font-size: 3mm !important;
          line-height: 1.1 !important;
        }
        
        /* Code d'accès en gros */
        #access-card .text-xl {
          font-size: 5mm !important;
          font-weight: bold !important;
          letter-spacing: 1mm !important;
        }
      }
    `;
    
    document.head.appendChild(printStyle);
    
    // Lancer l'impression
    window.print();
    
    // Nettoyer après impression
    setTimeout(() => {
      document.head.removeChild(printStyle);
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
