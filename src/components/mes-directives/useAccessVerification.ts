import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import { AccessFormValues } from "./AccessForm";

export interface VerificationResult {
  success: boolean;
  dossier?: any;
  error?: string;
}

export const useAccessVerification = (
  onSuccess?: (dossier: any) => void
) => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const [loading, setLoading] = useState(false);

  const verifyAccess = async (formValues: AccessFormValues): Promise<VerificationResult> => {
    setLoading(true);

    try {
      // Form validation
      if (!formValues.firstName || !formValues.lastName || !formValues.birthdate || !formValues.accessCode) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs"
        });
        return { success: false, error: "Veuillez remplir tous les champs" };
      }

      console.log("AccessSharedProfile - Submitting form:", formValues);

      // First try the RPC function approach
      const { data, error } = await supabase.rpc("verify_access_identity", {
        input_lastname: formValues.lastName,
        input_firstname: formValues.firstName,
        input_birthdate: formValues.birthdate,
        input_access_code: formValues.accessCode
      });

      console.log("RPC verification result:", data, error);

      // If RPC fails or returns no data, try edge function
      if (error || !data || data.length === 0) {
        console.log("RPC failed, trying edge function...");
        
        // Call the edge function as fallback
        const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessCode: formValues.accessCode,
            patientName: `${formValues.firstName} ${formValues.lastName}`,
            patientBirthDate: formValues.birthdate,
            bruteForceIdentifier: `directive_access_${formValues.firstName}_${formValues.lastName}`
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error("Edge function verification failed:", result.error);
          return { 
            success: false, 
            error: "Informations incorrectes ou accès expiré" 
          };
        }
        
        // Create dossier from edge function result
        const dossier = result.dossier;
        
        // Store in localStorage for access across the app
        localStorage.setItem("shared_dossier", JSON.stringify(dossier));
        
        // Store in the global state
        setDossierActif(dossier);
        
        toast({
          title: "Accès validé",
          description: "Redirection vers le dossier..."
        });
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess(dossier);
        } else {
          // Otherwise navigate directly
          navigate("/dashboard");
        }
        
        return { success: true, dossier };
      }

      // If RPC was successful
      // Log access for auditing
      await supabase.from("document_access_logs").insert({
        user_id: data[0].user_id || null,
        access_code_id: data[0].id,
        nom_consultant: formValues.lastName,
        prenom_consultant: formValues.firstName,
        ip_address: null,
        user_agent: navigator.userAgent || null
      });

      // Store dossier in local storage or state management
      const dossier = {
        id: data[0].id,
        userId: data[0].user_id || null,
        medical_profile_id: data[0].medical_profile_id,
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: {
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          birth_date: data[0].birthdate
        },
        contenu: {
          patient: {
            nom: data[0].last_name,
            prenom: data[0].first_name,
            date_naissance: data[0].birthdate
          }
        }
      };

      // Store in localStorage for access across the app
      localStorage.setItem("shared_dossier", JSON.stringify(dossier));
      
      // Store in the global state
      setDossierActif(dossier);

      toast({
        title: "Accès validé",
        description: "Redirection vers le dossier..."
      });

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(dossier);
      } else {
        // Otherwise navigate directly
        navigate("/dashboard");
      }

      return { success: true, dossier };

    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
      return { 
        success: false, 
        error: "Impossible de vérifier les informations" 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAccess,
    loading
  };
};
