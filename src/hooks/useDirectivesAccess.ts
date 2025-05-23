
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

export const useDirectivesAccess = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!firstName || !lastName || !birthdate || !accessCode) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Convert birthdate to ISO format for database comparison
      const formattedDate = birthdate.toISOString().split('T')[0];
      
      // Use the new RLS approach with request headers for verification
      const { data, error: queryError } = await supabase
        .from("shared_profiles")
        .select("*, medical_profile_id")
        .withHeaders({
          "x-client-info": "access-code-verification",
          "request.first_name": firstName.trim(),
          "request.last_name": lastName.trim(),
          "request.birthdate": formattedDate,
          "request.access_code": accessCode.trim()
        })
        .maybeSingle();

      if (queryError) {
        console.error("Error verifying access code:", queryError);
        throw new Error("Une erreur est survenue lors de la vérification du code d'accès");
      }

      if (!data) {
        // If not found with the RLS approach, try the edge function as fallback
        const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessCode: accessCode,
            bruteForceIdentifier: `directives_public_${firstName}_${lastName}`
          })
        });
        
        const result = await response.json();
        
        if (!result.success || !result.dossier) {
          setError("Informations incorrectes ou accès expiré");
          return;
        }
        
        // Store the dossier and navigate to dashboard
        setDossierActif(result.dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
        
        navigate("/dashboard", { replace: true });
      } else {
        // Shared profile found with RLS approach, create a dossier object
        const dossier = {
          id: data.id,
          userId: data.user_id,
          medical_profile_id: data.medical_profile_id,
          isFullAccess: true,
          isDirectivesOnly: true,
          isMedicalOnly: false, // Necessary required property
          profileData: {
            first_name: data.first_name,
            last_name: data.last_name,
            birth_date: data.birthdate
          },
          contenu: {
            patient: {
              nom: data.last_name,
              prenom: data.first_name,
              date_naissance: data.birthdate
            }
          }
        };
        
        // Store the dossier and navigate to dashboard
        setDossierActif(dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
        
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      console.error("Error during verification:", err);
      setError(err.message || "Une erreur est survenue lors de la vérification");
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier votre accès aux directives",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birthdate,
    setBirthdate,
    accessCode,
    setAccessCode,
    loading,
    error,
    handleVerify
  };
};
