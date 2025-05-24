
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { SharingService } from "@/hooks/sharing/core/sharingService";

export interface AccessFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  accessCode: string;
}

export interface AccessOptions {
  accessType?: 'directives' | 'medical' | 'full';
  redirectPath?: string;
}

export const useUnifiedAccess = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyAccess = async (
    formData: AccessFormData, 
    options: AccessOptions = {}
  ) => {
    const { accessType = 'full', redirectPath = '/dashboard' } = options;
    
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.accessCode) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le service unifié pour la validation
      const validationResult = await SharingService.validateAccessCode(
        formData.accessCode,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate
        }
      );

      if (validationResult.success && validationResult.documents) {
        const documents = validationResult.documents;
        const firstDoc = documents[0];
        
        const dossier = {
          id: `shared-access-${formData.accessCode}`,
          userId: firstDoc.user_id,
          isFullAccess: accessType === 'full',
          isDirectivesOnly: accessType === 'directives',
          isMedicalOnly: accessType === 'medical',
          profileData: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            birth_date: formData.birthDate
          },
          contenu: {
            patient: {
              nom: formData.lastName,
              prenom: formData.firstName,
              date_naissance: formData.birthDate
            },
            documents: documents.map(doc => ({
              ...doc.document_data,
              shared_at: doc.shared_at,
              source: 'shared_documents'
            }))
          }
        };
        
        setDossierActif(dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux données demandées",
        });
        
        navigate(redirectPath, { replace: true });
        return true;
      } else {
        setError("Informations incorrectes ou accès expiré");
        toast({
          title: "Accès refusé",
          description: validationResult.error || "Code d'accès invalide ou données incorrectes",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      console.error("Erreur lors de la vérification:", err);
      setError(err.message || "Une erreur est survenue lors de la vérification");
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier votre accès",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAccess,
    loading,
    error,
    setError
  };
};
