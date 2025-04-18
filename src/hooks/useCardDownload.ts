
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCardDownload() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCardPdf = async (pdfUrl: string, fileName: string = 'carte-directives-anticipees.pdf') => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible pour téléchargement",
        variant: "destructive"
      });
      return false;
    }

    setIsDownloading(true);
    
    try {
      console.log(`[CardDownload] Démarrage du téléchargement de ${fileName} depuis ${pdfUrl.substring(0, 30)}...`);
      
      // Utiliser fetch pour obtenir les données sous forme de blob
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error(`Échec de récupération du PDF: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log(`[CardDownload] Blob récupéré: taille=${blob.size}, type=${blob.type}`);
      
      // Vérifier que le blob est valide et a une taille
      if (blob.size === 0) {
        throw new Error("Le PDF généré est vide");
      }
      
      // S'assurer que le blob est bien un PDF avec le bon type MIME
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      
      // Créer une URL d'objet pour le téléchargement
      const objectUrl = URL.createObjectURL(pdfBlob);
      console.log(`[CardDownload] URL d'objet créée: ${objectUrl}`);
      
      // Créer un élément a temporaire pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      link.type = 'application/pdf';
      
      console.log(`[CardDownload] Déclenchement du téléchargement: ${fileName}`);
      
      // Ajouter au DOM, cliquer et supprimer
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer après le téléchargement
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
        console.log(`[CardDownload] Nettoyage effectué`);
      }, 100);
      
      toast({
        title: "Téléchargement démarré",
        description: `Le fichier ${fileName} est en cours de téléchargement`
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadCardPdf,
    isDownloading
  };
}
