
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
      // Pour les directives institution, utiliser directement le filePath si disponible
      let qrCodeUrl: string;
      
      if (filePath && filePath.startsWith('http')) {
        qrCodeUrl = filePath;
      } else {
        qrCodeUrl = `${window.location.origin}/pdf-viewer?id=${documentId}`;
      }

      // Vérifier que l'URL n'est pas trop longue pour le QR code
      if (!validateQRCodeData(qrCodeUrl)) {
        throw new Error(`URL trop longue pour le QR code (${qrCodeUrl.length} caractères, maximum ${QR_CODE_LIMITS.M})`);
      }

      const qrData: QRCodeData = {
        documentId,
        documentName,
        shareUrl: qrCodeUrl,
        qrCodeValue: qrCodeUrl,
        directPdfUrl: filePath || qrCodeUrl
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
    if (!qrCodeData?.qrCodeValue) return;

    try {
      await navigator.clipboard.writeText(qrCodeData.qrCodeValue);
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
