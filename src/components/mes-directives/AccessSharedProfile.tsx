
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { AccessForm, AccessFormValues } from "./AccessForm";
import { useAccessVerification } from "@/hooks/access/useAccessVerification";

interface AccessSharedProfileProps {
  onSuccess?: (dossier: any) => void;
  initialCode?: string | null;
}

export const AccessSharedProfile = ({ onSuccess, initialCode }: AccessSharedProfileProps) => {
  const { verifyAccess, loading, error, codeFromUrl } = useAccessVerification(onSuccess);
  
  // Use either the explicitly passed initialCode or the one from the URL
  const accessCode = initialCode || codeFromUrl;

  const handleSubmit = async (formValues: AccessFormValues) => {
    console.log("AccessSharedProfile - Form submitted:", formValues);
    try {
      // Merge passed code with form values if provided
      const valuesWithCode = accessCode ? {
        ...formValues,
        accessCode: accessCode
      } : formValues;
      
      const result = await verifyAccess(valuesWithCode);
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Échec de l'accès",
          description: result.error || "Informations incorrectes ou accès expiré"
        });
      } else {
        console.log("AccessSharedProfile - Access successful:", result.dossier);
        // No need for toast here as it's already handled in verifyAccess
        if (onSuccess) {
          onSuccess(result.dossier);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier les informations"
      });
    }
  };

  return (
    <AccessForm 
      onSubmit={handleSubmit} 
      loading={loading} 
      error={error} 
      initialCode={accessCode}
    />
  );
};
