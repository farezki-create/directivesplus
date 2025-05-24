
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";

interface InstitutionAccessState {
  accessGranted: boolean;
  loading: boolean;
  error: string | null;
  patientData: any | null;
}

export const useInstitutionCodeAccess = (
  code: string | null,
  nom: string | null,
  prenom: string | null,
  naissance: string | null,
  hasAllParams: boolean
) => {
  const [state, setState] = useState<InstitutionAccessState>({
    accessGranted: false,
    loading: false,
    error: null,
    patientData: null
  });
  
  const { setDossierActif } = useDossierStore();

  useEffect(() => {
    const tryInstitutionAccess = async () => {
      if (!hasAllParams || !code || !nom || !prenom || !naissance) {
        console.log("Paramètres manquants pour l'accès institution:", { code, nom, prenom, naissance });
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        console.log("Tentative d'accès par code institution:", { code, nom, prenom, naissance });

        const { data, error } = await supabase.rpc('get_patient_directives_by_institution_access', {
          input_last_name: nom,
          input_first_name: prenom,
          input_birth_date: naissance,
          input_shared_code: code,
        });

        console.log("Résultat RPC institution access:", { data, error });

        if (error) {
          throw new Error(error.message);
        }

        if (!data || data.length === 0) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Aucun patient trouvé avec ces informations (nom, prénom, date de naissance)"
          }));
          return;
        }

        // Créer un dossier pour le store
        const patientInfo = data[0];
        const dossier = {
          id: `institution-access-${patientInfo.id}`,
          userId: patientInfo.id,
          isFullAccess: true,
          isDirectivesOnly: false,
          isMedicalOnly: false,
          profileData: {
            first_name: patientInfo.first_name,
            last_name: patientInfo.last_name,
            birth_date: patientInfo.birth_date
          },
          contenu: {
            patient: {
              nom: patientInfo.last_name,
              prenom: patientInfo.first_name,
              date_naissance: patientInfo.birth_date
            }
          }
        };

        console.log("Dossier créé pour accès institution:", dossier);
        setDossierActif(dossier);

        setState(prev => ({
          ...prev,
          loading: false,
          accessGranted: true,
          patientData: patientInfo
        }));

        toast({
          title: "Accès autorisé",
          description: `Accès aux directives de ${patientInfo.first_name} ${patientInfo.last_name}`,
        });

      } catch (error: any) {
        console.error("Erreur lors de l'accès par code institution:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || "Erreur lors de la vérification du code d'accès"
        }));
      }
    };

    tryInstitutionAccess();
  }, [code, nom, prenom, naissance, hasAllParams, setDossierActif]);

  return state;
};
