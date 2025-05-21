
import { FormData } from "./validationSchema";
import { checkMedicalAccessCode } from "./databaseUtils";
import { showErrorToast, showSuccessToast } from "./toastUtils";

// Type for the medical access result
export interface MedicalAccessResult {
  success: boolean;
  error?: string;
  userId?: string;
  accessCodeId?: string;
  resourceId?: string;
}

// Function to access medical data
export const accessMedicalData = async (formData: FormData): Promise<MedicalAccessResult> => {
  console.log("Données du formulaire pour données médicales:", formData);
  
  try {
    // Check medical access code
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
    
    // Access granted
    console.log("Accès aux données médicales accordé");
    showSuccessToast("Accès autorisé", "Chargement des données médicales...");
    
    // Redirect to medical data page after a short delay
    setTimeout(() => {
      window.location.href = '/donnees-medicales';
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
  }
};
