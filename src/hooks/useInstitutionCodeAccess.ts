
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDirectivesStore } from "@/store/directivesStore";
import { toast } from "@/hooks/use-toast";
import { DirectiveItem, InstitutionAccessState } from "@/types/directivesTypes";
import { validateProfessionalId } from "@/utils/professional-id-validation";

interface PatientInfo {
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface SupabaseAccessResponse {
  access_granted: boolean;
  user_id: string;
  patient_info: any;
  directives: any;
  documents: any;
}

export const useInstitutionCodeAccess = (
  code: string | null,
  nom: string | null,
  prenom: string | null,
  naissance: string | null,
  professionalId: string | null,
  hasAllParams: boolean
) => {
  const [state, setState] = useState<InstitutionAccessState>({
    accessGranted: false,
    loading: false,
    error: null,
    patientData: null,
    directiveItems: []
  });
  
  const { setDocuments } = useDirectivesStore();

  useEffect(() => {
    const tryInstitutionAccess = async () => {
      if (!hasAllParams || !code || !nom || !prenom || !naissance || !professionalId) {
        console.log("Paramètres manquants pour l'accès institution:", { code, nom, prenom, naissance, professionalId });
        return;
      }

      const professionalIdValidation = validateProfessionalId(professionalId);
      if (!professionalIdValidation.isValid) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: `Numéro d'identification professionnel invalide: ${professionalIdValidation.error}`
        }));
        return;
      }

      console.log("Début de la tentative d'accès par code institution:", { 
        code, 
        nom, 
        prenom, 
        naissance, 
        professionalId: professionalIdValidation.formattedNumber,
        professionalIdType: professionalIdValidation.type
      });
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        await supabase
          .from('document_access_logs')
          .insert({
            user_id: '00000000-0000-0000-0000-000000000000',
            access_code_id: 'institution_access_attempt',
            nom_consultant: 'Institution',
            prenom_consultant: `${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`,
            ip_address: 'institution_access',
            user_agent: `Institution Access Attempt | Patient: ${prenom} ${nom} | Birth: ${naissance} | Code: ${code} | Professional: ${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`
          });

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
          
          await supabase
            .from('document_access_logs')
            .insert({
              user_id: '00000000-0000-0000-0000-000000000000',
              access_code_id: 'institution_access_failed',
              nom_consultant: 'Institution',
              prenom_consultant: `${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`,
              ip_address: 'institution_access',
              user_agent: `Institution Access FAILED | Patient: ${prenom} ${nom} | Error: ${accessError.message} | Professional: ${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`
            });
          
          throw new Error(`Erreur de base de données: ${accessError.message}`);
        }

        if (!accessResult || !Array.isArray(accessResult) || accessResult.length === 0) {
          await supabase
            .from('document_access_logs')
            .insert({
              user_id: '00000000-0000-0000-0000-000000000000',
              access_code_id: 'institution_access_denied',
              nom_consultant: 'Institution',
              prenom_consultant: `${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`,
              ip_address: 'institution_access',
              user_agent: `Institution Access DENIED | Patient: ${prenom} ${nom} | Reason: No results | Professional: ${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`
            });
          
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
          await supabase
            .from('document_access_logs')
            .insert({
              user_id: result.user_id || '00000000-0000-0000-0000-000000000000',
              access_code_id: 'institution_access_denied',
              nom_consultant: 'Institution',
              prenom_consultant: `${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`,
              ip_address: 'institution_access',
              user_agent: `Institution Access DENIED | Patient: ${prenom} ${nom} | Reason: Access not granted | Professional: ${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`
            });
          
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Accès refusé. Vérifiez le code d'accès et les informations du patient."
          }));
          return;
        }

        await supabase
          .from('document_access_logs')
          .insert({
            user_id: result.user_id,
            access_code_id: 'institution_access_granted',
            nom_consultant: 'Institution',
            prenom_consultant: `${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`,
            ip_address: 'institution_access',
            user_agent: `Institution Access GRANTED | Patient: ${prenom} ${nom} | Professional: ${professionalIdValidation.type}:${professionalIdValidation.formattedNumber} | Documents: ${result.documents?.length || 0} | Directives: ${result.directives?.length || 0}`
          });

        sessionStorage.setItem('institutionAccess', 'true');
        sessionStorage.setItem('institutionProfessionalId', `${professionalIdValidation.type}:${professionalIdValidation.formattedNumber}`);
        
        const patientInfo: PatientInfo = {
          first_name: result.patient_info?.first_name || prenom || '',
          last_name: result.patient_info?.last_name || nom || '',
          birth_date: result.patient_info?.birth_date || naissance || '',
        };

        const directiveItems: DirectiveItem[] = [];
        
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

        directiveItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const documents = directiveItems.map(item => ({
          id: item.id,
          file_name: item.file_name || 'Document',
          file_path: item.file_path || '',
          created_at: item.created_at,
          content_type: item.content_type,
          user_id: result.user_id
        }));

        setDocuments(documents);

        setState(prev => ({
          ...prev,
          loading: false,
          accessGranted: true,
          directiveItems,
          patientData: patientInfo
        }));

        toast({
          title: "Accès autorisé",
          description: `Accès aux directives de ${patientInfo.first_name} ${patientInfo.last_name} (${professionalIdValidation.type}: ${professionalIdValidation.formattedNumber})`,
        });

        const firstPdfDocument = directiveItems.find(item => 
          item.type === 'document' && 
          item.file_path && 
          (item.content_type === 'application/pdf' || item.file_name?.toLowerCase().endsWith('.pdf'))
        );

        if (firstPdfDocument) {
          console.log("Ouverture automatique dans le viewer interne:", firstPdfDocument);
          setTimeout(() => {
            window.location.href = `/pdf-viewer?id=${firstPdfDocument.id}&type=document`;
          }, 1000);
        }

      } catch (error: any) {
        console.error("Erreur lors de l'accès par code institution:", error);
        
        await supabase
          .from('document_access_logs')
          .insert({
            user_id: '00000000-0000-0000-0000-000000000000',
            access_code_id: 'institution_access_error',
            nom_consultant: 'Institution',
            prenom_consultant: `${professionalIdValidation?.type || 'UNKNOWN'}:${professionalIdValidation?.formattedNumber || professionalId}`,
            ip_address: 'institution_access',
            user_agent: `Institution Access ERROR | Patient: ${prenom} ${nom} | Error: ${error.message} | Professional: ${professionalIdValidation?.type || 'UNKNOWN'}:${professionalIdValidation?.formattedNumber || professionalId}`
          });
        
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

    const timeoutId = setTimeout(() => {
      tryInstitutionAccess();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [code, nom, prenom, naissance, professionalId, hasAllParams, setDocuments]);

  return state;
};
