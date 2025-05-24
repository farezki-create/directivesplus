
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface QRCodeData {
  documentId: string;
  documentName: string;
  shareUrl: string;
  qrCodeValue: string;
  directPdfUrl: string;
}

// Limites de capacité des QR codes selon le niveau de correction d'erreur
const QR_CODE_LIMITS = {
  L: 2953,  // Low
  M: 2331,  // Medium
  Q: 1663,  // Quartile
  H: 1273   // High
};

export const useQRCodeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateQRCodeData = (data: string): boolean => {
    // Utiliser la limite Medium (M) qui est un bon compromis
    return data.length <= QR_CODE_LIMITS.M;
  };

  const createShortUrl = (documentId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/document/${documentId}`;
  };

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
      
      // Toujours utiliser l'URL courte pour le QR code
      const shortUrl = createShortUrl(documentId);
      
      console.log("QR Code generation:", {
        documentId,
        documentName,
        shortUrl,
        urlLength: shortUrl.length,
        isValidLength: validateQRCodeData(shortUrl)
      });

      // Vérifier que l'URL n'est pas trop longue pour le QR code
      if (!validateQRCodeData(shortUrl)) {
        throw new Error(`URL trop longue pour le QR code (${shortUrl.length} caractères, maximum ${QR_CODE_LIMITS.M})`);
      }
      
      let directPdfUrl = shortUrl;
      
      // Si on a un chemin de fichier direct et qu'il n'est pas trop long, l'utiliser comme URL directe
      if (filePath && (filePath.startsWith('http') || filePath.startsWith('/')) && !filePath.startsWith('data:')) {
        if (validateQRCodeData(filePath)) {
          directPdfUrl = filePath;
        } else {
          console.warn("Chemin du fichier trop long, utilisation de l'URL de redirection");
        }
      }
      
      const qrData: QRCodeData = {
        documentId,
        documentName,
        shareUrl: shortUrl,
        qrCodeValue: shortUrl, // Toujours utiliser l'URL courte pour le QR code
        directPdfUrl
      };

      setQrCodeData(qrData);
      
      toast({
        title: "QR Code généré",
        description: `QR Code créé pour ${documentName}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la génération du QR code";
      console.error("Erreur génération QR code:", err);
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
        description: "Le lien a été copié dans le presse-papiers",
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
