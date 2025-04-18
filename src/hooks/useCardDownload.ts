
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCardDownload() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadCardPdf = async (pdfUrl: string, fileName: string = 'carte-directives-anticipees.pdf') => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible pour téléchargement",
        variant: "destructive"
      });
      setDownloadError("URL non disponible");
      return false;
    }

    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      console.log(`[CardDownload] Début du téléchargement - Source: ${pdfUrl.substring(0, 50)}...`);
      
      // Vérifier si l'URL est de type Blob ou Data URL
      if (pdfUrl.startsWith('blob:')) {
        console.log(`[CardDownload] Utilisation d'une URL Blob`);
        
        // Récupérer le contenu depuis l'URL Blob
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Erreur de récupération depuis l'URL Blob: ${response.status}`);
        }
        
        // Récupérer le blob
        const blob = await response.blob();
        console.log(`[CardDownload] Blob récupéré depuis URL: type=${blob.type}, taille=${blob.size} octets`);
        
        // Vérifier que le blob est valide
        if (blob.size === 0) {
          throw new Error("Le fichier PDF généré est vide");
        }
        
        // S'assurer que le type MIME est correct
        const pdfBlob = blob.type === 'application/pdf' 
          ? blob 
          : new Blob([blob], { type: 'application/pdf' });
          
        return await downloadBlob(pdfBlob, fileName);
      }
      else if (pdfUrl.startsWith('data:')) {
        console.log(`[CardDownload] Utilisation d'une Data URL`);
        
        // Vérifier que la data URL est bien un PDF
        if (!pdfUrl.includes('application/pdf')) {
          console.warn(`[CardDownload] Type MIME incorrect dans la Data URL`);
        }
        
        try {
          // Convertir la data URL en Blob
          const base64Response = await fetch(pdfUrl);
          const blob = await base64Response.blob();
          console.log(`[CardDownload] Blob créé depuis Data URL: type=${blob.type}, taille=${blob.size} octets`);
          
          // Vérifier que le blob est valide
          if (blob.size === 0) {
            throw new Error("Le fichier PDF généré est vide");
          }
          
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          return await downloadBlob(pdfBlob, fileName);
        } catch (dataUrlError) {
          console.error(`[CardDownload] Erreur de conversion Data URL:`, dataUrlError);
          
          // Méthode alternative avec lien direct si la méthode fetch échoue
          console.log(`[CardDownload] Tentative avec méthode de lien direct`);
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = fileName;
          link.type = 'application/pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: "Téléchargement lancé",
            description: `Le fichier est en cours de téléchargement (méthode alternative)`
          });
          return true;
        }
      }
      else {
        // URL standard - utiliser fetch classique
        console.log(`[CardDownload] Utilisation d'une URL standard`);
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Échec de récupération: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log(`[CardDownload] Blob récupéré depuis URL standard: type=${blob.type}, taille=${blob.size} octets`);
        
        if (blob.size === 0) {
          throw new Error("Le fichier PDF généré est vide");
        }
        
        // S'assurer que le type MIME est correct
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        return await downloadBlob(pdfBlob, fileName);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error(`[CardDownload] Erreur lors du téléchargement:`, errorMessage, error);
      setDownloadError(errorMessage);
      toast({
        title: "Échec du téléchargement",
        description: "Impossible de télécharger le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  // Fonction helper pour télécharger un blob
  const downloadBlob = async (blob: Blob, fileName: string): Promise<boolean> => {
    try {
      if (blob.size === 0) {
        throw new Error("Le fichier est vide");
      }
      
      console.log(`[CardDownload] Préparation du téléchargement: ${fileName}, type=${blob.type}, taille=${blob.size} octets`);
      
      // Créer une URL d'objet pour le téléchargement
      const blobUrl = URL.createObjectURL(blob);
      
      // Créer un élément a pour le téléchargement
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.type = 'application/pdf';
      
      console.log(`[CardDownload] URL d'objet créée: ${blobUrl}`);
      console.log(`[CardDownload] Déclenchement du téléchargement: ${fileName}`);
      
      // Ajouter au DOM, cliquer et supprimer
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer après un court délai
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        console.log(`[CardDownload] Nettoyage effectué`);
      }, 200);
      
      toast({
        title: "Téléchargement démarré",
        description: `Le fichier ${fileName} est en cours de téléchargement`
      });
      
      return true;
    } catch (error) {
      console.error(`[CardDownload] Erreur lors du téléchargement du blob:`, error);
      throw error;
    }
  };

  return {
    downloadCardPdf,
    isDownloading,
    downloadError,
    hasError: !!downloadError
  };
}
