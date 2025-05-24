
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
      // Toujours utiliser l'URL de l'application pour le QR code
      const appUrl = `https://24c30559-a746-463d-805e-d2330d3a13f4.lovableproject.com/pdf-viewer?id=${documentId}`;
      
      console.log("QR Code generation:", {
        documentId,
        documentName,
        appUrl,
        urlLength: appUrl.length,
        isValidLength: validateQRCodeData(appUrl)
      });

      // Vérifier que l'URL n'est pas trop longue pour le QR code
      if (!validateQRCodeData(appUrl)) {
        // Utiliser une URL de redirection plus courte
        const shortUrl = `https://24c30559-a746-463d-805e-d2330d3a13f4.lovableproject.com/pdf/${documentId}`;
        
        if (!validateQRCodeData(shortUrl)) {
          throw new Error(`URL trop longue pour le QR code (${shortUrl.length} caractères, maximum ${QR_CODE_LIMITS.M})`);
        }
        
        const qrData: QRCodeData = {
          documentId,
          documentName,
          shareUrl: shortUrl,
          qrCodeValue: shortUrl,
          directPdfUrl: filePath || appUrl
        };

        setQrCodeData(qrData);
      } else {
        const qrData: QRCodeData = {
          documentId,
          documentName,
          shareUrl: appUrl,
          qrCodeValue: appUrl,
          directPdfUrl: filePath || appUrl
        };

        setQrCodeData(qrData);
      }
      
      toast({
        title: "QR Code généré",
        description: `QR Code créé pour ${documentName} - Ouverture dans l'application`,
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
