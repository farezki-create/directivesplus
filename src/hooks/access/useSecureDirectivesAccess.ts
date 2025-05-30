
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSecureAccessCode } from "@/hooks/useSecureAccessCode";
import { useDirectivesStore } from "@/store/directivesStore";
import { toast } from "@/hooks/use-toast";
import { accessCodeLimiter } from "@/utils/security/rateLimiting";
import { accessCodeSchema } from "@/utils/security/validation";
import { useSecureAuth } from "@/hooks/useSecureAuth";

type FormData = z.infer<typeof accessCodeSchema>;

export const useSecureDirectivesAccess = () => {
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  
  const { validateAccessCode } = useSecureAccessCode();
  const { setDocuments } = useDirectivesStore();
  const { logSecurityEvent } = useSecureAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(accessCodeSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const getClientInfo = () => {
    return {
      userAgent: navigator.userAgent,
      // In a real app, you'd get the IP from the server
      ipAddress: null
    };
  };

  const handleSubmit = async () => {
    const values = form.getValues();
    const identifier = `${values.firstName}_${values.lastName}_${values.birthDate}`;
    
    // Check rate limiting
    if (accessCodeLimiter.isBlocked(identifier)) {
      const remainingTime = accessCodeLimiter.getRemainingTime(identifier);
      setBlocked(true);
      setBlockTimeRemaining(remainingTime);
      
      await logSecurityEvent(
        'rate_limit_exceeded',
        { identifier, type: 'directive_access' },
        'high'
      );
      
      toast({
        title: "Trop de tentatives",
        description: `Veuillez patienter ${Math.ceil(remainingTime / 60000)} minutes avant de réessayer`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const clientInfo = getClientInfo();
      
      // Validate access code using the secure function
      const result = await validateAccessCode(
        values.accessCode,
        clientInfo.ipAddress,
        clientInfo.userAgent
      );
      
      if (result.isValid) {
        // Success - reset rate limiting
        await accessCodeLimiter.reset(identifier);
        setBlocked(false);
        setRemainingAttempts(null);
        
        await logSecurityEvent(
          'directive_access_success',
          { 
            identifier,
            documentId: result.documentId,
            accessCode: values.accessCode.substring(0, 3) + '***' // Partial code for logging
          },
          'low'
        );
        
        // In a real implementation, you would fetch the documents here
        // For now, we'll just show success
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
        
        // Redirect to directives page
        window.location.href = '/directives-docs';
      } else {
        // Failed attempt
        const limitResult = await accessCodeLimiter.recordAttempt(identifier);
        setRemainingAttempts(limitResult.remainingAttempts);
        
        if (limitResult.blocked) {
          setBlocked(true);
          setBlockTimeRemaining(accessCodeLimiter.getRemainingTime(identifier));
        }
        
        await logSecurityEvent(
          'directive_access_failed',
          { 
            identifier,
            errorMessage: result.errorMessage,
            remainingAttempts: limitResult.remainingAttempts
          },
          limitResult.blocked ? 'high' : 'medium'
        );
        
        // Error message is already shown by the validateAccessCode function
      }
      
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      
      // Record failed attempt
      const limitResult = await accessCodeLimiter.recordAttempt(identifier);
      setRemainingAttempts(limitResult.remainingAttempts);
      
      await logSecurityEvent(
        'directive_access_error',
        { identifier, error: error.message },
        'high'
      );
      
      toast({
        title: "Erreur d'accès",
        description: "Une erreur est survenue lors de la vérification. Réessayez.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    blocked,
    remainingAttempts,
    blockTimeRemaining,
    handleSubmit
  };
};
