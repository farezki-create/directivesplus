
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

        // D'abord vérifier l'accès avec la fonction existante
        const { data: accessData, error: accessError } = await supabase
          .rpc('verify_institution_access', {
            input_last_name: nom,
            input_first_name: prenom,
            input_birth_date: naissance,
            input_institution_code: code,
          });

        console.log("Résultat vérification accès:", { accessData, accessError });

        if (accessError) {
          throw new Error(accessError.message);
        }

        if (!accessData || !Array.isArray(accessData) || accessData.length === 0) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Accès refusé. Vérifiez le code d'accès et les informations du patient."
          }));
          return;
        }

        const accessInfo = accessData[0];
        const userId = accessInfo.user_id;

        // Récupérer les directives directement de la table
        const { data: directivesData, error: directivesError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        console.log("Résultat directives:", { directivesData, directivesError });

        // Récupérer les documents PDF
        const { data: documentsData, error: documentsError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        console.log("Résultat documents:", { documentsData, documentsError });

        // Préparer le contenu des directives
        let directivesContent = [];
        
        // Ajouter les directives textuelles
        if (directivesData && Array.isArray(directivesData)) {
          directivesData.forEach(directive => {
            directivesContent.push({
              id: directive.id,
              type: 'directive',
              content: directive.content,
              created_at: directive.created_at
            });
          });
        }
        
        // Ajouter les documents PDF
        if (documentsData && Array.isArray(documentsData) && documentsData.length > 0) {
          const documentsList = documentsData.map(doc => ({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            file_type: doc.content_type || 'pdf',
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
          id: `institution-access-${userId || 'unknown'}`,
          userId: userId || '',
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
            documents: documentsData || []
          }
        };

        console.log("Dossier créé pour accès institution:", dossier);
        setDossierActif(dossier);

        setState(prev => ({
          ...prev,
          loading: false,
          accessGranted: true,
          patientData: {
            user_id: userId,
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
