
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SecureDocumentAccess } from "@/utils/security/secureDocumentAccess";
import { ServerSideRateLimit } from "@/utils/security/serverSideRateLimit";

interface AccessCodeValidation {
  isValid: boolean;
  documentId?: string;
  userId?: string;
  errorMessage?: string;
  remainingAttempts?: number;
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
      const clientIP = ipAddress || '127.0.0.1';
      const clientUserAgent = userAgent || navigator.userAgent;
      
      // Check rate limiting first using secure function
      const rateLimitResult = await ServerSideRateLimit.checkRateLimit(
        `access_code_${clientIP}`,
        'access_code_validation',
        5,
        15,
        clientIP,
        clientUserAgent
      );

      if (!rateLimitResult.allowed) {
        toast({
          title: "Trop de tentatives",
          description: "Veuillez patienter avant de réessayer",
          variant: "destructive"
        });
        
        return { 
          isValid: false, 
          errorMessage: "Trop de tentatives. Veuillez patienter.",
          remainingAttempts: rateLimitResult.remainingAttempts
        };
      }

      // Log the access attempt
      await supabase
        .from('access_code_attempts')
        .insert({
          ip_address: clientIP,
          access_code: accessCode,
          success: false, // Will be updated if successful
          user_agent: clientUserAgent
        });

      // Validate access code using secure function
      const { data, error } = await supabase.rpc('validate_and_use_access_code', {
        _access_code: accessCode,
        _ip_address: clientIP,
        _user_agent: clientUserAgent
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
          errorMessage: result.error_message,
          remainingAttempts: rateLimitResult.remainingAttempts - 1
        };
      }

      // Update successful attempt
      await supabase
        .from('access_code_attempts')
        .update({ success: true })
        .eq('access_code', accessCode)
        .eq('ip_address', clientIP)
        .order('attempt_time', { ascending: false })
        .limit(1);

      // Record successful rate limit reset
      await ServerSideRateLimit.recordSuccessfulAttempt(
        `access_code_${clientIP}`,
        'access_code_validation',
        clientIP,
        clientUserAgent
      );

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
