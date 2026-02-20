
import { toast } from "@/hooks/use-toast";

/**
 * Handles document download for dossier documents
 */
export const handleDossierDownload = (filePath: string, fileName: string) => {
  try {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement commencé",
      description: `${fileName} est en cours de téléchargement`,
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le document",
      variant: "destructive"
    });
  }
};

/**
 * Handles document printing for dossier documents
 */
export const handleDossierPrint = (filePath: string, fileType?: string) => {
  const printWindow = window.open(filePath, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    toast({
      title: "Erreur",
      description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups sont autorisés.",
      variant: "destructive"
    });
  }
};

/**
 * Handles document viewing for dossier documents
 */
export const handleDossierView = (filePath: string, fileType?: string) => {
  window.open(filePath, '_blank');
};

/**
 * Handles upload completion (disabled for dossier mode)
 */
export const handleDossierUploadComplete = () => {
  toast({
    title: "Information",
    description: "L'ajout de documents n'est pas disponible en mode consultation",
    variant: "default"
  });
};

/**
 * Handles document deletion (disabled for dossier mode)
 */
export const handleDossierDelete = async (documentId: string) => {
  toast({
    title: "Information",
    description: "La suppression de documents n'est pas disponible en mode consultation",
    variant: "default"
  });
};
