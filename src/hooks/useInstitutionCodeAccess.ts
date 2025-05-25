
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

        // Utiliser la nouvelle fonction RPC pour vérifier l'accès
        const { data: verificationData, error: verificationError } = await supabase
          .rpc('verify_institution_access', {
            input_last_name: nom,
            input_first_name: prenom,
            input_birth_date: naissance,
            input_institution_code: code,
          });

        console.log("Résultat vérification institution access:", { verificationData, verificationError });

        if (verificationError) {
          throw new Error(verificationError.message);
        }

        if (!verificationData || verificationData.length === 0) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Accès refusé. Vérifiez le code d'accès et les informations du patient."
          }));
          return;
        }

        const patientInfo = verificationData[0];

        // Récupérer les directives du patient
        const { data: directivesData, error: directivesError } = await supabase
          .rpc('get_patient_directives_by_institution', {
            input_last_name: nom,
            input_first_name: prenom,
            input_birth_date: naissance,
            input_institution_code: code,
          });

        console.log("Directives récupérées:", { directivesData, directivesError });

        // Récupérer aussi les documents PDF du patient si disponibles
        const { data: documentsData, error: documentsError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', patientInfo.user_id)
          .order('created_at', { ascending: false });

        console.log("Documents récupérés:", { documentsData, documentsError });

        // Préparer le contenu des directives/documents
        let directivesContent = [];
        
        if (directivesData && directivesData.length > 0) {
          directivesContent = directivesData.map(directive => ({
            id: directive.directive_id,
            type: 'directive',
            content: directive.directive_content,
            created_at: directive.created_at,
            patient_info: directive.patient_info
          }));
        }
        
        if (documentsData && documentsData.length > 0) {
          const documentsList = documentsData.map(doc => ({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            file_type: doc.content_type || 'pdf', // Utiliser content_type au lieu de file_type
            content_type: doc.content_type,
            user_id: doc.user_id,
            created_at: doc.created_at,
            description: doc.description,
            file_size: doc.file_size
          }));
          directivesContent = [...directivesContent, ...documentsList];
        }

        // Créer un dossier pour le store
        const dossier = {
          id: `institution-access-${patientInfo.user_id}`,
          userId: patientInfo.user_id,
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
            },
            directives: directivesContent,
            documents: documentsData || []
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
