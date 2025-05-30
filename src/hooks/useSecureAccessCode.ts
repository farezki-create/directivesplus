
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
      // Get client IP (in production, this would come from server)
      const clientIP = ipAddress || '127.0.0.1';
      
      // Check rate limiting first
      const { data: rateLimitCheck, error: rateLimitError } = await supabase
        .rpc('check_access_code_rate_limit', {
          p_ip_address: clientIP
        });

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
      }

      if (rateLimitCheck === false) {
        // Log the rate limit violation
        await supabase.rpc('log_security_event_enhanced', {
          p_event_type: 'access_code_rate_limit_exceeded',
          p_ip_address: clientIP,
          p_user_agent: userAgent || navigator.userAgent,
          p_details: {
            access_code: accessCode.substring(0, 3) + '***',
            client_info: navigator.userAgent
          },
          p_risk_level: 'high'
        });

        toast({
          title: "Trop de tentatives",
          description: "Veuillez patienter avant de réessayer",
          variant: "destructive"
        });
        
        return { 
          isValid: false, 
          errorMessage: "Trop de tentatives. Veuillez patienter." 
        };
      }

      // Log the access attempt
      await supabase
        .from('access_code_attempts')
        .insert({
          ip_address: clientIP,
          access_code: accessCode,
          success: false, // Will be updated if successful
          user_agent: userAgent || navigator.userAgent
        });

      // Validate access code using secure function
      const { data, error } = await supabase.rpc('validate_and_use_access_code', {
        _access_code: accessCode,
        _ip_address: clientIP,
        _user_agent: userAgent || navigator.userAgent
      });

      if (error) {
        console.error('Error validating access code:', error);
        
        // Log security event for validation error
        await supabase.rpc('log_security_event_enhanced', {
          p_event_type: 'access_code_validation_error',
          p_ip_address: clientIP,
          p_user_agent: userAgent || navigator.userAgent,
          p_details: {
            access_code: accessCode.substring(0, 3) + '***',
            error: error.message
          },
          p_risk_level: 'medium'
        });

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
        // Log failed attempt
        await supabase.rpc('log_security_event_enhanced', {
          p_event_type: 'invalid_access_code_attempt',
          p_ip_address: clientIP,
          p_user_agent: userAgent || navigator.userAgent,
          p_details: {
            access_code: accessCode.substring(0, 3) + '***',
            error_message: result.error_message
          },
          p_risk_level: 'high'
        });

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

      // Update successful attempt
      await supabase
        .from('access_code_attempts')
        .update({ success: true })
        .eq('access_code', accessCode)
        .eq('ip_address', clientIP)
        .order('attempt_time', { ascending: false })
        .limit(1);

      // Log successful access
      await supabase.rpc('log_security_event_enhanced', {
        p_event_type: 'valid_access_code_used',
        p_user_id: result.user_id,
        p_ip_address: clientIP,
        p_user_agent: userAgent || navigator.userAgent,
        p_details: {
          access_code: accessCode.substring(0, 3) + '***',
          document_id: result.document_id
        },
        p_risk_level: 'low',
        p_resource_id: result.document_id,
        p_resource_type: 'document_access'
      });

      return {
        isValid: true,
        documentId: result.document_id,
        userId: result.user_id
      };

    } catch (error) {
      console.error('Unexpected error validating access code:', error);
      
      // Log unexpected error
      await supabase.rpc('log_security_event_enhanced', {
        p_event_type: 'access_code_system_error',
        p_ip_address: ipAddress || '127.0.0.1',
        p_user_agent: userAgent || navigator.userAgent,
        p_details: {
          access_code: accessCode.substring(0, 3) + '***',
          error: error.message
        },
        p_risk_level: 'critical'
      });

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
