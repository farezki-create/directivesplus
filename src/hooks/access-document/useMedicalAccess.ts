
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/utils/access-document/validationSchema";
import { checkMedicalAccessCode } from "@/utils/access-document/databaseUtils";
import { showErrorToast, showSuccessToast } from "@/utils/access-document/toastUtils";

export const useMedicalAccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const accessMedicalData = async (formData: FormData) => {
    console.log("Données du formulaire pour données médicales:", formData);
    
    setLoading(true);
    try {
      // Vérification du code d'accès médical
      const profilesData = await checkMedicalAccessCode(formData.accessCode);
      
      if (!profilesData || profilesData.length === 0) {
        console.log("Code d'accès médical invalide");
        showErrorToast("Accès refusé", "Code d'accès médical invalide");
        return;
      }
      
      const profile = profilesData[0];
      console.log("Profil médical trouvé:", profile);
      
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profile.first_name.toLowerCase() !== formData.firstName.toLowerCase() || 
          profile.last_name.toLowerCase() !== formData.lastName.toLowerCase() ||
          !birthDateMatch) {
        console.log("Informations personnelles médicales incorrectes");
        showErrorToast("Accès refusé", "Informations personnelles incorrectes");
        return;
      }
      
      // Accès accordé
      console.log("Accès aux données médicales accordé");
      showSuccessToast("Accès autorisé", "Chargement des données médicales...");
      
      // Navigation vers la page des données médicales après un court délai
      setTimeout(() => {
        navigate('/donnees-medicales');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux données médicales:", error);
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    accessMedicalData
  };
};
