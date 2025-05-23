
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { AccessForm, AccessFormValues } from "./AccessForm";
import { useAccessVerification } from "./useAccessVerification";

interface AccessSharedProfileProps {
  onSuccess?: (dossier: any) => void;
}

export const AccessSharedProfile = ({ onSuccess }: AccessSharedProfileProps) => {
  const { verifyAccess, loading, error, codeFromUrl } = useAccessVerification(onSuccess);

  const handleSubmit = async (formValues: AccessFormValues) => {
    console.log("AccessSharedProfile - Form submitted:", formValues);
    try {
      const result = await verifyAccess(formValues);
      
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
    />
  );
};
