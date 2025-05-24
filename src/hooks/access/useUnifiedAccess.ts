
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

export interface AccessFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  accessCode: string;
}

export interface AccessOptions {
  accessType?: 'directives' | 'medical' | 'full';
  redirectPath?: string;
}

export const useUnifiedAccess = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyAccess = async (
    formData: AccessFormData, 
    options: AccessOptions = {}
  ) => {
    setLoading(true);
    setError("Fonctionnalité temporairement désactivée");
    
    toast({
      title: "Accès refusé",
      description: "Le système de partage a été désactivé pour simplification",
      variant: "destructive"
    });
    
    setLoading(false);
    return false;
  };

  return {
    verifyAccess,
    loading,
    error,
    setError
  };
};
