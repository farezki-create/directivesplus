
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/utils/access-document/validationSchema";
import { checkDirectivesAccessCode, checkProfileMatch } from "@/utils/access-document/databaseUtils";
import { showErrorToast, showSuccessToast } from "@/utils/access-document/toastUtils";

export const useDirectivesAccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const accessDirectives = async (formData: FormData) => {
    console.log("Données du formulaire pour directives:", formData);
    
    setLoading(true);
    try {
      // Vérification du code d'accès
      const accessData = await checkDirectivesAccessCode(formData.accessCode);
      
      if (!accessData || accessData.length === 0) {
        console.log("Code d'accès invalide");
        showErrorToast("Accès refusé", "Code d'accès invalide");
        return;
      }
      
      const userId = accessData[0].user_id;
      console.log("ID utilisateur récupéré:", userId);
      
      // Vérification des informations du profil
      const { isMatch } = await checkProfileMatch(userId, formData);
      
      if (!isMatch) {
        console.log("Informations personnelles incorrectes");
        showErrorToast("Accès refusé", "Informations personnelles incorrectes");
        return;
      }
      
      // Accès accordé
      console.log("Accès aux directives accordé");
      showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
      
      // Navigation vers la page des directives après un court délai
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
    } finally {
      setLoading(false);
    }
    
    return { loading };
  };

  return {
    loading,
    accessDirectives
  };
};
