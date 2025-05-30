
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AccessCodeValidation {
  isValid: boolean;
  documentId?: string;
  userId?: string;
  errorMessage?: string;
}

export const useSecureAccessCode = () => {
  const [loading, setLoading] = useState(false);

  const validateAccessCode = async (
    accessCode: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AccessCodeValidation> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('validate_and_use_access_code', {
        _access_code: accessCode,
        _ip_address: ipAddress || null,
        _user_agent: userAgent || navigator.userAgent
      });

      if (error) {
        console.error('Error validating access code:', error);
        toast({
          title: "Erreur de validation",
          description: "Impossible de valider le code d'accès",
          variant: "destructive"
        });
        return { isValid: false, errorMessage: "Erreur système" };
      }

      const result = data?.[0];
      if (!result) {
        return { isValid: false, errorMessage: "Réponse invalide du serveur" };
      }

      if (!result.is_valid) {
        toast({
          title: "Code d'accès invalide",
          description: result.error_message || "Le code d'accès fourni n'est pas valide",
          variant: "destructive"
        });
        return { 
          isValid: false, 
          errorMessage: result.error_message 
        };
      }

      return {
        isValid: true,
        documentId: result.document_id,
        userId: result.user_id
      };

    } catch (error) {
      console.error('Unexpected error validating access code:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return { isValid: false, errorMessage: "Erreur inattendue" };
    } finally {
      setLoading(false);
    }
  };

  return {
    validateAccessCode,
    loading
  };
};
