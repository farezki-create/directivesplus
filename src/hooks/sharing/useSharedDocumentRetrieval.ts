
import { 
  getSharedDocuments as fetchSharedDocuments,
  getSharedDocumentsByAccessCode as fetchSharedDocumentsByAccessCode,
  deactivateSharedDocument
} from "./sharingService";
import { toast } from "@/hooks/use-toast";

export const useSharedDocumentRetrieval = () => {
  const getSharedDocuments = async (): Promise<any[]> => {
    try {
      return await fetchSharedDocuments();
    } catch (error) {
      console.error("Erreur lors de la récupération des documents partagés:", error);
      return [];
    }
  };

  const getSharedDocumentsByAccessCode = async (
    accessCode: string,
    firstName?: string,
    lastName?: string,
    birthDate?: string
  ): Promise<any[]> => {
    try {
      return await fetchSharedDocumentsByAccessCode(accessCode, firstName, lastName, birthDate);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents avec code:", error);
      return [];
    }
  };

  const stopSharing = async (sharedDocumentId: string): Promise<boolean> => {
    try {
      await deactivateSharedDocument(sharedDocumentId);

      toast({
        title: "Partage arrêté",
        description: "Le document a été retiré du dossier partagé",
      });

      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'arrêt du partage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter le partage",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    getSharedDocuments,
    getSharedDocumentsByAccessCode,
    stopSharing
  };
};
