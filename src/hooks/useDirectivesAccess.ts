
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useDirectivesStore } from "@/store/directivesStore";

export const useDirectivesAccess = () => {
  const navigate = useNavigate();
  const { setDocuments } = useDirectivesStore();
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
      const formattedDate = birthdate.toISOString().split('T')[0];
      
      const { data, error: queryError } = await supabase
        .from("shared_profiles")
        .select("*, medical_profile_id")
        .eq("first_name", firstName.trim())
        .eq("last_name", lastName.trim())
        .eq("birthdate", formattedDate)
        .eq("access_code", accessCode.trim())
        .maybeSingle();

      if (queryError) {
        console.error("Error verifying access code:", queryError);
        throw new Error("Une erreur est survenue lors de la vérification du code d'accès");
      }

      if (!data) {
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
        
        if (result.dossier.contenu?.documents) {
          setDocuments(result.dossier.contenu.documents);
        }
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
        
        navigate("/dashboard", { replace: true });
      } else {
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
