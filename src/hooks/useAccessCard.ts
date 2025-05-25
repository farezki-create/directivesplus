
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
    // Créer un style spécialement optimisé pour l'impression format carte bancaire
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        @page {
          size: 85.6mm 53.98mm;
          margin: 0;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body * {
          visibility: hidden !important;
        }
        
        #access-card, 
        #access-card * {
          visibility: visible !important;
        }
        
        #access-card {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 85.6mm !important;
          height: 53.98mm !important;
          margin: 0 !important;
          padding: 4mm !important;
          box-sizing: border-box !important;
          transform: none !important;
          border-radius: 2mm !important;
          background: linear-gradient(135deg, #4338ca 0%, #312e81 100%) !important;
          color: white !important;
          font-family: 'Inter', Arial, sans-serif !important;
          font-size: 2.5mm !important;
          line-height: 1.2 !important;
          overflow: hidden !important;
        }
        
        /* Header */
        #access-card .flex:first-child {
          margin-bottom: 1mm !important;
        }
        
        #access-card .flex:first-child svg {
          width: 3mm !important;
          height: 3mm !important;
        }
        
        #access-card .flex:first-child span {
          font-size: 2mm !important;
          font-weight: bold !important;
        }
        
        /* Section patient */
        #access-card .bg-white.bg-opacity-15:first-of-type {
          margin-top: 0.5mm !important;
          margin-bottom: 8mm !important;
          padding: 2mm !important;
          border-radius: 1.5mm !important;
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        #access-card .text-lg {
          font-size: 3.5mm !important;
          font-weight: bold !important;
          margin-bottom: 0.5mm !important;
        }
        
        #access-card .text-sm {
          font-size: 2.8mm !important;
          margin-bottom: 0.5mm !important;
        }
        
        /* QR Code */
        #access-card svg {
          width: 15mm !important;
          height: 15mm !important;
        }
        
        /* Section code d'accès */
        #access-card .absolute.bottom-4 {
          position: absolute !important;
          bottom: 2mm !important;
          left: 4mm !important;
          right: 4mm !important;
        }
        
        #access-card .absolute.bottom-4 .bg-white.bg-opacity-15 {
          padding: 2mm !important;
          border-radius: 1.5mm !important;
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        #access-card .font-mono {
          font-size: 2.2mm !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          letter-spacing: 0.3mm !important;
        }
        
        #access-card .bg-white.bg-opacity-25 {
          padding: 1.5mm 2mm !important;
          border-radius: 1mm !important;
          background: rgba(255, 255, 255, 0.25) !important;
          border: 0.2mm solid rgba(255, 255, 255, 0.3) !important;
        }
        
        /* Textes généraux */
        #access-card .text-xs {
          font-size: 2mm !important;
        }
        
        #access-card .uppercase {
          text-transform: uppercase !important;
        }
        
        /* Masquer les éléments décoratifs non essentiels */
        #access-card .absolute.top-0,
        #access-card .absolute.bottom-0.left-0 {
          display: none !important;
        }
        
        /* Assurer la bonne visibilité des couleurs */
        #access-card * {
          color: white !important;
        }
      }
    `;
    
    document.head.appendChild(printStyle);
    
    // Petit délai pour que les styles soient appliqués
    setTimeout(() => {
      window.print();
      
      // Nettoyer après impression
      setTimeout(() => {
        document.head.removeChild(printStyle);
      }, 1000);
    }, 100);
    
    toast({
      title: "Impression lancée",
      description: "La carte d'accès va être imprimée au format carte bancaire"
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
