
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Affiche un document dans une nouvelle fenêtre
 */
export const viewDocument = async (filePath: string, contentType?: string) => {
  try {
    if (filePath.startsWith('data:')) {
      // Data URL - ouvrir directement
      const newWindow = window.open();
      if (newWindow) {
        newWindow.location.href = filePath;
      }
      return;
    }

    // URL de fichier stocké
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600);

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      throw new Error('Impossible de générer l\'URL du document');
    }
  } catch (error) {
    console.error('Erreur lors de l\'affichage du document:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'afficher le document",
      variant: "destructive"
    });
  }
};

/**
 * Télécharge un document
 */
export const downloadDocument = async (filePath: string, fileName: string) => {
  try {
    if (filePath.startsWith('data:')) {
      // Data URL - téléchargement direct
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // URL de fichier stocké
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600);

    if (data?.signedUrl) {
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error('Impossible de générer l\'URL de téléchargement');
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le document",
      variant: "destructive"
    });
  }
};

/**
 * Imprime un document
 */
export const printDocument = async (filePath: string, contentType?: string) => {
  try {
    if (filePath.startsWith('data:')) {
      // Data URL - impression directe
      const printWindow = window.open();
      if (printWindow) {
        if (contentType?.includes('image')) {
          printWindow.document.write(`<img src="${filePath}" onload="window.print();window.close();" />`);
        } else {
          printWindow.location.href = filePath;
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }
      return;
    }

    // URL de fichier stocké
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600);

    if (data?.signedUrl) {
      const printWindow = window.open(data.signedUrl);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      throw new Error('Impossible de générer l\'URL d\'impression');
    }
  } catch (error) {
    console.error('Erreur lors de l\'impression:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le document",
      variant: "destructive"
    });
  }
};

/**
 * Partage un document
 */
export const shareDocument = async (documentId: string) => {
  // Cette fonction sera implémentée avec le système de partage unifié
  console.log('Partage du document:', documentId);
  toast({
    title: "Fonctionnalité à venir",
    description: "Le partage sera bientôt disponible",
  });
};
