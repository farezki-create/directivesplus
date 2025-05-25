
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { DirectiveItem, InstitutionAccessState } from "@/types/directives";

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
    patientData: null,
    directiveItems: []
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

        // Utiliser la nouvelle fonction SQL sécurisée
        const { data: accessResult, error: accessError } = await supabase
          .rpc('get_institution_directives_complete', {
            input_last_name: nom,
            input_first_name: prenom,
            input_birth_date: naissance,
            input_institution_code: code,
          });

        console.log("Résultat accès complet:", { accessResult, accessError });

        if (accessError) {
          throw new Error(accessError.message);
        }

        if (!accessResult || !Array.isArray(accessResult) || accessResult.length === 0) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Erreur lors de la récupération des données. Veuillez réessayer."
          }));
          return;
        }

        const result = accessResult[0];
        
        if (!result.access_granted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Accès refusé. Vérifiez le code d'accès et les informations du patient."
          }));
          return;
        }

        // Normaliser et combiner les directives et documents
        const directiveItems: DirectiveItem[] = [];
        
        // Ajouter les directives textuelles
        if (result.directives && Array.isArray(result.directives)) {
          result.directives.forEach((directive: any) => {
            directiveItems.push({
              id: directive.id,
              type: 'directive',
              content: directive.content,
              created_at: directive.created_at
            });
          });
        }
        
        // Ajouter les documents PDF
        if (result.documents && Array.isArray(result.documents)) {
          result.documents.forEach((document: any) => {
            directiveItems.push({
              id: document.id,
              type: 'document',
              file_path: document.file_path,
              file_name: document.file_name,
              content_type: document.content_type,
              file_size: document.file_size,
              description: document.description,
              created_at: document.created_at
            });
          });
        }

        // Trier par date de création (plus récent en premier)
        directiveItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Créer un dossier normalisé pour le store
        const dossier = {
          id: `institution-access-${result.user_id}`,
          userId: result.user_id || '',
          isFullAccess: true,
          isDirectivesOnly: false,
          isMedicalOnly: false,
          profileData: result.patient_info,
          contenu: {
            patient: {
              nom: result.patient_info?.last_name || nom,
              prenom: result.patient_info?.first_name || prenom,
              date_naissance: result.patient_info?.birth_date || naissance
            },
            directives: directiveItems
          }
        };

        console.log("Dossier créé pour accès institution:", dossier);
        setDossierActif(dossier);

        setState(prev => ({
          ...prev,
          loading: false,
          accessGranted: true,
          directiveItems,
          patientData: result.patient_info
        }));

        toast({
          title: "Accès autorisé",
          description: `Accès aux directives de ${result.patient_info?.first_name} ${result.patient_info?.last_name}`,
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
