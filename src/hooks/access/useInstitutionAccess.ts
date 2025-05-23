
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { logAccessEvent } from "@/utils/accessLoggingUtils";

export interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface DirectiveDocument {
  id: string;
  user_id: string;
  content: any;
  created_at: string;
}

export const useInstitutionAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DirectiveDocument[]>([]);

  const verifyInstitutionAccess = async (values: InstitutionAccessFormValues): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Verifying institution access with values:", values);
      
      const { data, error } = await supabase.rpc("get_directives_by_institution_code", {
        input_nom: values.lastName.trim(),
        input_prenom: values.firstName.trim(),
        input_date_naissance: values.birthDate,
        input_institution_code: values.institutionCode.trim()
      });
      
      if (error) {
        console.error("Institution access verification error:", error);
        setError("Impossible de vérifier l'accès. Veuillez réessayer.");
        setDocuments([]);
        return false;
      }
      
      if (!data || data.length === 0) {
        setError("Code invalide ou expiré, ou informations du patient incorrectes.");
        setDocuments([]);
        return false;
      }
      
      // Log the successful access
      const directiveIds = data.map(doc => doc.id);
      await logInstitutionAccess(directiveIds, values);
      
      setDocuments(data);
      
      toast({
        title: "Accès autorisé",
        description: "Vous pouvez maintenant consulter les directives du patient"
      });
      
      return true;
    } catch (err) {
      console.error("Error during institution access verification:", err);
      setError("Une erreur est survenue lors de la vérification de l'accès.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logInstitutionAccess = async (directiveIds: string[], values: InstitutionAccessFormValues) => {
    try {
      for (const directiveId of directiveIds) {
        // Log access in the access_logs table
        await supabase.from("access_logs").insert({
          directive_id: directiveId,
          access_type: "institution",
          access_by: `Institution médicale (${values.firstName} ${values.lastName})`,
          ip_address: "client_side",
          user_agent: navigator.userAgent
        });
        
        // Use the existing logging utility for consistency
        await logAccessEvent({
          userId: "00000000-0000-0000-0000-000000000000", // Anonymous/institution access
          accessCodeId: "00000000-0000-0000-0000-000000000000",
          consultantName: values.lastName,
          consultantFirstName: values.firstName,
          resourceType: "directive",
          resourceId: directiveId,
          action: "institution_access",
          success: true,
          details: `Institution access using code: ${values.institutionCode}`
        });
      }
    } catch (err) {
      console.error("Failed to log institution access:", err);
    }
  };

  return {
    loading,
    error,
    documents,
    verifyInstitutionAccess
  };
};
