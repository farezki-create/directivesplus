
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import { DirectiveItem, InstitutionAccessState } from "@/types/directives";

// Interface pour typer les données patient retournées par SQL
interface PatientInfo {
  first_name: string;
  last_name: string;
  birth_date: string;
}

// Interface pour typer la réponse brute de Supabase
interface SupabaseAccessResponse {
  access_granted: boolean;
  user_id: string;
  patient_info: any; // Json type from Supabase
  directives: any; // Json type from Supabase
  documents: any; // Json type from Supabase
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

      console.log("Début de la tentative d'accès par code institution:", { code, nom, prenom, naissance });
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Utiliser la nouvelle fonction SQL sécurisée
        const { data: accessResult, error: accessError } = await supabase
          .rpc('get_institution_directives_complete', {
            input_last_name: nom,
            input_first_name: prenom,
            input_birth_date: naissance,
            input_institution_code: code,
          });

        console.log("Résultat RPC:", { accessResult, accessError });

        if (accessError) {
          console.error("Erreur RPC:", accessError);
          throw new Error(`Erreur de base de données: ${accessError.message}`);
        }

        if (!accessResult || !Array.isArray(accessResult) || accessResult.length === 0) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Aucun résultat retourné. Vérifiez les informations saisies."
          }));
          return;
        }

        const result = accessResult[0] as SupabaseAccessResponse;
        console.log("Résultat parsé:", result);
        
        if (!result.access_granted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Accès refusé. Vérifiez le code d'accès et les informations du patient."
          }));
          return;
        }

        // Marquer l'accès institution en session (comme pour les QR codes)
        sessionStorage.setItem('institutionAccess', 'true');
        
        // Conversion sécurisée des données patient
        const patientInfo: PatientInfo = {
          first_name: result.patient_info?.first_name || prenom || '',
          last_name: result.patient_info?.last_name || nom || '',
          birth_date: result.patient_info?.birth_date || naissance || '',
        };

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

        // Créer un dossier normalisé pour le store avec typage correct
        const profileData = {
          first_name: patientInfo.first_name,
          last_name: patientInfo.last_name,
          birth_date: patientInfo.birth_date,
        };

        const dossier = {
          id: `institution-access-${result.user_id}`,
          userId: result.user_id || '',
          isFullAccess: true,
          isDirectivesOnly: false,
          isMedicalOnly: false,
          profileData,
          contenu: {
            patient: {
              nom: profileData.last_name,
              prenom: profileData.first_name,
              date_naissance: profileData.birth_date
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
          patientData: patientInfo
        }));

        toast({
          title: "Accès autorisé",
          description: `Accès aux directives de ${profileData.first_name} ${profileData.last_name}`,
        });

        // Ouvrir automatiquement le premier PDF si disponible
        const firstPdfDocument = directiveItems.find(item => 
          item.type === 'document' && 
          item.file_path && 
          (item.content_type === 'application/pdf' || item.file_name?.toLowerCase().endsWith('.pdf'))
        );

        if (firstPdfDocument) {
          console.log("Ouverture automatique du premier document PDF:", firstPdfDocument);
          setTimeout(() => {
            window.open(firstPdfDocument.file_path, '_blank');
          }, 1000);
        }

      } catch (error: any) {
        console.error("Erreur lors de l'accès par code institution:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || "Erreur lors de la vérification du code d'accès"
        }));
        
        toast({
          title: "Erreur d'accès",
          description: error.message || "Impossible de vérifier le code d'accès",
          variant: "destructive"
        });
      }
    };

    // Éviter les appels répétés avec un délai
    const timeoutId = setTimeout(() => {
      tryInstitutionAccess();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [code, nom, prenom, naissance, hasAllParams, setDossierActif]);

  return state;
};
