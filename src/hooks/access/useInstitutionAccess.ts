
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
      // Nettoyer et valider les données d'entrée
      const cleanedValues = {
        lastName: values.lastName.trim().toUpperCase(),
        firstName: values.firstName.trim().toUpperCase(),
        birthDate: values.birthDate.trim(),
        institutionCode: values.institutionCode.trim().toUpperCase()
      };

      console.log("Verifying institution access with cleaned values:", cleanedValues);
      
      // Valider le format de la date
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(cleanedValues.birthDate)) {
        setError("Format de date invalide. Utilisez le format AAAA-MM-JJ.");
        return false;
      }

      // Valider que le code institution n'est pas vide
      if (!cleanedValues.institutionCode) {
        setError("Le code d'accès institution est requis.");
        return false;
      }

      // Vérifier d'abord si le code institution existe et n'est pas expiré
      const { data: existingCodes, error: codeCheckError } = await supabase
        .from('directives')
        .select('id, institution_code_expires_at')
        .eq('institution_code', cleanedValues.institutionCode)
        .not('institution_code_expires_at', 'is', null);

      if (codeCheckError) {
        console.error("Error checking institution code:", codeCheckError);
        setError("Erreur lors de la vérification du code institution.");
        return false;
      }

      if (!existingCodes || existingCodes.length === 0) {
        console.log("No directives found with this institution code");
        setError("Code d'accès institution invalide.");
        return false;
      }

      // Vérifier si le code n'est pas expiré
      const now = new Date();
      const validCodes = existingCodes.filter(code => 
        new Date(code.institution_code_expires_at) > now
      );

      if (validCodes.length === 0) {
        console.log("Institution code has expired");
        setError("Le code d'accès institution a expiré.");
        return false;
      }

      console.log("Valid institution codes found:", validCodes.length);

      // Appeler la fonction RPC avec les données nettoyées
      const { data, error } = await supabase.rpc("get_directives_by_institution_code", {
        input_nom: cleanedValues.lastName,
        input_prenom: cleanedValues.firstName,
        input_date_naissance: cleanedValues.birthDate,
        input_institution_code: cleanedValues.institutionCode
      });
      
      if (error) {
        console.error("Institution access RPC error:", error);
        setError("Erreur lors de la vérification de l'accès. Détails: " + error.message);
        setDocuments([]);
        return false;
      }
      
      console.log("RPC response:", data);
      
      // Variable pour stocker les données finales
      let finalData = data;
      
      if (!data || data.length === 0) {
        // Essayer avec différentes variations de casse pour les noms
        console.log("Trying with different case variations...");
        
        const variations = [
          { lastName: values.lastName.trim(), firstName: values.firstName.trim() },
          { lastName: values.lastName.trim().toLowerCase(), firstName: values.firstName.trim().toLowerCase() },
          { lastName: capitalizeFirstLetter(values.lastName.trim()), firstName: capitalizeFirstLetter(values.firstName.trim()) }
        ];

        let foundData = null;
        for (const variation of variations) {
          console.log("Trying variation:", variation);
          const { data: varData, error: varError } = await supabase.rpc("get_directives_by_institution_code", {
            input_nom: variation.lastName,
            input_prenom: variation.firstName,
            input_date_naissance: cleanedValues.birthDate,
            input_institution_code: cleanedValues.institutionCode
          });
          
          if (!varError && varData && varData.length > 0) {
            foundData = varData;
            console.log("Found match with variation:", variation);
            break;
          }
        }

        if (!foundData) {
          console.log("No matching patient found with any name variation");
          setError("Aucune directive trouvée pour ce patient avec ce code d'accès. Vérifiez les informations saisies.");
          setDocuments([]);
          return false;
        }
        
        finalData = foundData;
      }
      
      // Log the successful access
      const directiveIds = finalData.map(doc => doc.id);
      await logInstitutionAccess(directiveIds, cleanedValues);
      
      setDocuments(finalData);
      
      toast({
        title: "Accès autorisé",
        description: `${finalData.length} directive(s) trouvée(s) pour le patient`
      });
      
      return true;
    } catch (err) {
      console.error("Error during institution access verification:", err);
      setError("Une erreur inattendue est survenue lors de la vérification de l'accès.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
