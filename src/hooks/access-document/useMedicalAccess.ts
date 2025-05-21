
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormData } from "@/utils/access-document/validationSchema";
import { checkMedicalAccessCode } from "@/utils/access-document/databaseUtils";
import { showErrorToast, showSuccessToast } from "@/utils/access-document/toastUtils";

export interface MedicalAccessResult {
  success: boolean;
  error?: string;
  userId?: string;
  accessCodeId?: string;
  resourceId?: string;
}

export const useMedicalAccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const accessMedicalData = async (formData: FormData): Promise<MedicalAccessResult> => {
    console.log("Données du formulaire pour données médicales:", formData);
    
    setLoading(true);
    try {
      // Vérification du code d'accès médical
      const profilesData = await checkMedicalAccessCode(formData.accessCode);
      
      if (!profilesData || profilesData.length === 0) {
        console.log("Code d'accès médical invalide");
        showErrorToast("Accès refusé", "Code d'accès médical invalide");
        return { 
          success: false,
          error: "Code d'accès médical invalide"
        };
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
        return {
          success: false,
          error: "Informations personnelles incorrectes" 
        };
      }
      
      // Accès accordé
      console.log("Accès aux données médicales accordé");
      showSuccessToast("Accès autorisé", "Chargement des données médicales...");
      
      // Navigation vers la page des données médicales après un court délai
      setTimeout(() => {
        navigate('/donnees-medicales');
      }, 1000);
      
      return {
        success: true,
        userId: profile.id,
        accessCodeId: profile.medical_access_code || 'unknown',
        resourceId: profile.id
      };
    } catch (error: any) {
      console.error("Erreur d'accès aux données médicales:", error);
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
      
      return {
        success: false,
        error: error.message || "Une erreur est survenue"
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    accessMedicalData
  };
};
