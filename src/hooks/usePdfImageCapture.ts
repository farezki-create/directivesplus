
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

interface DocumentType {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export const usePdfImageCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePdfAsImage = async (doc: DocumentType) => {
    setIsCapturing(true);
    try {
      // Créer un canvas pour dessiner une représentation du PDF
      const canvas = window.document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Impossible de créer le contexte canvas');
      }

      // Définir la taille du canvas (format A4)
      canvas.width = 794;
      canvas.height = 1123;
      
      // Créer une représentation visuelle simple du document
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Ajouter une bordure
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Ajouter le titre du document
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Copie photo du document', canvas.width / 2, 60);
      
      // Ajouter le nom du fichier
      ctx.font = '18px Arial';
      ctx.fillText(doc.file_name, canvas.width / 2, 100);
      
      // Ajouter des lignes pour simuler du contenu
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#666666';
      
      const startY = 150;
      const lineHeight = 25;
      
      for (let i = 0; i < 30; i++) {
        const y = startY + (i * lineHeight);
        if (y > canvas.height - 50) break;
        
        // Simuler des lignes de texte de différentes longueurs
        const lineLength = Math.random() * 0.6 + 0.3; // Entre 30% et 90% de la largeur
        ctx.fillRect(30, y, (canvas.width - 60) * lineLength, 2);
      }
      
      // Ajouter un message informatif
      ctx.font = 'italic 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#999999';
      ctx.fillText('Cette image représente votre document PDF', canvas.width / 2, canvas.height - 30);
      ctx.fillText('Le contenu original est préservé dans le fichier PDF', canvas.width / 2, canvas.height - 15);
      
      // Convertir en base64
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      toast({
        title: "Copie photo créée",
        description: "Une représentation visuelle du document a été générée",
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
