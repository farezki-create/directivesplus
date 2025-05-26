
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export const usePdfImageCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePdfAsImage = async (document: Document) => {
    setIsCapturing(true);
    try {
      // Créer un iframe temporaire pour capturer le PDF
      const iframe = document.createElement('iframe');
      iframe.src = document.file_path;
      iframe.style.width = '794px'; // Format A4
      iframe.style.height = '1123px';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Attendre que l'iframe soit chargé
      await new Promise((resolve) => {
        iframe.onload = resolve;
        setTimeout(resolve, 3000); // Timeout de sécurité
      });

      // Utiliser html2canvas pour capturer l'iframe
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(iframe, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: 794,
        height: 1123
      });

      // Convertir en base64
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      // Nettoyer
      document.body.removeChild(iframe);
      
      toast({
        title: "Copie photo créée",
        description: "Le document a été capturé en tant qu'image",
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      toast({
        title: "Erreur de capture",
        description: "Impossible de créer la copie photo du document",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const clearCapturedImage = () => {
    setCapturedImage(null);
  };

  return {
    capturedImage,
    isCapturing,
    capturePdfAsImage,
    clearCapturedImage
  };
};
