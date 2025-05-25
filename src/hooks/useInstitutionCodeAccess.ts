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

        // Utiliser la nouvelle fonction RPC sécurisée
        const { data: directivesData, error: directivesError } = await supabase
          .rpc('get_institution_directives_secure', {
            input_last_name: nom,
            input_first_name: prenom,
            input_birth_date: naissance,
            input_institution_code: code,
          });

        console.log("Résultat directives sécurisées:", { directivesData, directivesError });

        if (directivesError) {
          throw new Error(directivesError.message);
        }

        if (!directivesData || directivesData.length === 0) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Accès refusé. Vérifiez le code d'accès et les informations du patient."
          }));
          return;
        }

        // Récupérer les infos patient depuis la première directive
        const firstDirective = directivesData[0];
        
        // Extraire les documents PDF du premier résultat
        const pdfDocuments = firstDirective.pdf_documents || [];

        // Préparer le contenu des directives
        let directivesContent = [];
        
        // Ajouter les directives textuelles
        directivesData.forEach(directive => {
          directivesContent.push({
            id: directive.directive_id,
            type: 'directive',
            content: directive.directive_content,
            created_at: directive.created_at
          });
        });
        
        // Ajouter les documents PDF
        if (pdfDocuments.length > 0) {
          const documentsList = pdfDocuments.map(doc => ({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            file_type: doc.content_type || 'pdf',
            content_type: doc.content_type,
            user_id: firstDirective.user_id,
            created_at: doc.created_at,
            description: doc.description,
            file_size: doc.file_size
          }));
          directivesContent = [...directivesContent, ...documentsList];
        }

        // Créer un dossier pour le store
        const dossier = {
          id: `institution-access-${firstDirective.user_id || 'unknown'}`,
          userId: firstDirective.user_id || '',
          isFullAccess: true,
          isDirectivesOnly: false,
          isMedicalOnly: false,
          profileData: {
            first_name: prenom,
            last_name: nom,
            birth_date: naissance
          },
          contenu: {
            patient: {
              nom: nom,
              prenom: prenom,
              date_naissance: naissance
            },
            directives: directivesContent,
            documents: pdfDocuments || []
          }
        };

        console.log("Dossier créé pour accès institution:", dossier);
        setDossierActif(dossier);

        setState(prev => ({
          ...prev,
          loading: false,
          accessGranted: true,
          patientData: {
            user_id: firstDirective.user_id,
            first_name: prenom,
            last_name: nom,
            birth_date: naissance
          }
        }));

        toast({
          title: "Accès autorisé",
          description: `Accès aux directives de ${prenom} ${nom}`,
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
