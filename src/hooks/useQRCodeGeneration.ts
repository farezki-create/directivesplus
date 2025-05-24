
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface QRCodeData {
  documentId: string;
  documentName: string;
  shareUrl: string;
  qrCodeValue: string;
  directPdfUrl: string;
}

export const useQRCodeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = useCallback((documentId: string, documentName: string, filePath?: string) => {
    if (!documentId) {
      setError("ID du document manquant");
      toast({
        title: "Erreur",
        description: "Impossible de générer le QR code: ID du document manquant",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;
      
      // Créer une URL directe vers le PDF si disponible
      let directPdfUrl = '';
      let qrCodeValue = '';
      
      if (filePath && (filePath.startsWith('http') || filePath.startsWith('data:'))) {
        // Si on a le chemin direct du fichier, l'utiliser directement
        directPdfUrl = filePath;
        qrCodeValue = filePath;
      } else {
        // Sinon, utiliser la route de document avec redirection automatique
        const shareUrl = `${baseUrl}/document/${documentId}`;
        qrCodeValue = shareUrl;
        directPdfUrl = shareUrl;
      }
      
      const qrData: QRCodeData = {
        documentId,
        documentName,
        shareUrl: `${baseUrl}/document/${documentId}`,
        qrCodeValue,
        directPdfUrl
      };

      setQrCodeData(qrData);
      
      toast({
        title: "QR Code généré",
        description: `QR Code créé pour ${documentName}`,
      });
    } catch (err) {
      const errorMessage = "Erreur lors de la génération du QR code";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearQRCode = useCallback(() => {
    setQrCodeData(null);
    setError(null);
  }, []);

  const copyShareUrl = useCallback(async () => {
    if (!qrCodeData?.directPdfUrl) return;

    try {
      await navigator.clipboard.writeText(qrCodeData.directPdfUrl);
      toast({
        title: "Lien copié",
        description: "Le lien direct vers le PDF a été copié",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  }, [qrCodeData]);

  return {
    qrCodeData,
    isGenerating,
    error,
    generateQRCode,
    clearQRCode,
    copyShareUrl
  };
};
