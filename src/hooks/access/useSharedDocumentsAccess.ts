
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { SharingService } from "@/hooks/sharing/core/sharingService";

interface AccessFormData {
  accessCode: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

interface AccessResult {
  success: boolean;
  message: string;
  documents?: any[];
}

export const useSharedDocumentsAccess = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AccessResult | null>(null);
  const { setDossierActif } = useDossierStore();

  const validateAccess = async (formData: AccessFormData): Promise<AccessResult> => {
    setLoading(true);
    setResult(null);

    try {
      console.log("=== VALIDATION ACCÈS DOCUMENTS PARTAGÉS (UNIFIÉ) ===");
      console.log("Données:", formData);

      const validationResult = await SharingService.validateAccessCode(
        formData.accessCode,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate
        }
      );

      console.log("Résultat validation:", validationResult);

      if (validationResult.success && validationResult.documents) {
        const documents = validationResult.documents;
        
        // Créer un dossier temporaire avec les documents partagés
        const firstDoc = documents[0];
        const dossier = {
          id: `shared-access-${formData.accessCode}`,
          userId: firstDoc.user_id,
          isFullAccess: false,
          isDirectivesOnly: false,
          isMedicalOnly: false,
          isSharedAccess: true,
          profileData: null,
          contenu: {
            patient: {
              nom: "Accès partagé",
              prenom: "",
              date_naissance: null
            },
            documents: documents.map(doc => ({
              ...doc,
              source: 'shared_documents'
            }))
          }
        };

        setDossierActif(dossier);

        const result: AccessResult = {
          success: true,
          message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`,
          documents: documents
        };

        setResult(result);
        return result;
      } else {
        const result: AccessResult = {
          success: false,
          message: validationResult.error || "Code d'accès invalide ou aucun document trouvé."
        };

        setResult(result);
        return result;
      }

    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      const result: AccessResult = {
        success: false,
        message: "Une erreur est survenue lors de la vérification."
      };

      setResult(result);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    validateAccess
  };
};
