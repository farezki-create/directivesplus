
import { Dispatch, SetStateAction } from "react";
import { getUserDossier } from "@/api/dossier/userDossierAccess";
import type { DirectiveDocument } from "@/types/directivesTypes";

interface AuthenticatedDossier {
  id: string;
  userId: string;
  documents: DirectiveDocument[];
}

export const useAuthenticatedDossier = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const getDossierAuthenticated = async (userId: string, accessType?: string): Promise<AuthenticatedDossier | null> => {
    setLoading(true);
    try {
      const result = await getUserDossier(userId);
      
      if (result.success && result.dossier) {
        const convertedDossier: AuthenticatedDossier = {
          id: result.dossier.id,
          userId: result.dossier.userId,
          documents: result.dossier.contenu?.documents || []
        };
        
        return convertedDossier;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting authenticated user dossier:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getDossierAuthenticated
  };
};
