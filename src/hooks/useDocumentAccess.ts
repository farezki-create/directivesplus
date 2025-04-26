
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScalingoAccessControl } from "@/utils/cloud/scalingo/ScalingoAccessControl";

export function useDocumentAccess() {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyAccess = async (accessCode: string, firstName: string, lastName: string, birthDate: string) => {
    try {
      setIsVerifying(true);
      
      // First try the database verification through Supabase
      const { data, error } = await supabase
        .rpc('verify_document_access', {
          p_access_code: accessCode,
          p_first_name: firstName,
          p_last_name: lastName,
          p_birth_date: birthDate
        });

      if (error) {
        console.error('DB verification error:', error);
        // If Supabase verification fails, fall back to Scalingo verification
        const documentId = await ScalingoAccessControl.verifyAccess(accessCode, {
          firstName,
          lastName,
          birthDate
        });
        
        if (documentId) {
          // Return a compatible format to the one Supabase would return
          return {
            document_id: documentId,
            is_full_access: accessCode.startsWith('DM-')
          };
        }
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('[useDocumentAccess] Error verifying access:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier l'accès au document",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerifying,
    verifyAccess
  };
}
