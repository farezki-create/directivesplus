
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
    const { accessType = 'full', redirectPath = '/dashboard' } = options;
    
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.accessCode) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Essayer d'abord avec la table shared_profiles
      const { data: sharedProfile, error: profileError } = await supabase
        .from("shared_profiles")
        .select("*, medical_profile_id")
        .eq("first_name", formData.firstName.trim())
        .eq("last_name", formData.lastName.trim())
        .eq("birthdate", formData.birthDate)
        .eq("access_code", formData.accessCode.trim())
        .maybeSingle();

      if (sharedProfile) {
        const dossier = {
          id: sharedProfile.id,
          userId: sharedProfile.user_id,
          medical_profile_id: sharedProfile.medical_profile_id,
          isFullAccess: accessType === 'full',
          isDirectivesOnly: accessType === 'directives',
          isMedicalOnly: accessType === 'medical',
          profileData: {
            first_name: sharedProfile.first_name,
            last_name: sharedProfile.last_name,
            birth_date: sharedProfile.birthdate
          },
          contenu: {
            patient: {
              nom: sharedProfile.last_name,
              prenom: sharedProfile.first_name,
              date_naissance: sharedProfile.birthdate
            }
          }
        };
        
        setDossierActif(dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux données demandées",
        });
        
        navigate(redirectPath, { replace: true });
        return true;
      }

      // Fallback vers l'edge function
      const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: formData.accessCode,
          patientName: `${formData.firstName} ${formData.lastName}`,
          patientBirthDate: formData.birthDate,
          bruteForceIdentifier: `${accessType}_access_${formData.firstName}_${formData.lastName}`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setDossierActif(result.dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux données demandées",
        });
        
        navigate(redirectPath, { replace: true });
        return true;
      } else {
        setError("Informations incorrectes ou accès expiré");
        toast({
          title: "Accès refusé",
          description: result.error || "Code d'accès invalide ou données incorrectes",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      console.error("Erreur lors de la vérification:", err);
      setError(err.message || "Une erreur est survenue lors de la vérification");
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier votre accès",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAccess,
    loading,
    error,
    setError
  };
};
