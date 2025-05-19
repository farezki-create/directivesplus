
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/utils/access";
import { DirectivesFormData } from "./types";
import { verifyDirectivesAccess } from "./verification";

export const useFormSubmission = () => {
  const navigate = useNavigate();

  const handleFormSubmission = async (formData: DirectivesFormData) => {
    console.log("Données du formulaire pour directives:", formData);
    
    try {
      const verificationResult = await verifyDirectivesAccess(formData);
      
      if (!verificationResult.isValid) {
        showErrorToast("Accès refusé", verificationResult.error || "Erreur d'accès aux directives");
        return {
          success: false,
          error: verificationResult.error || "Erreur d'accès aux directives",
          errorType: verificationResult.errorType
        };
      }
      
      const userId = verificationResult.userId as string;
      
      // Accès accordé
      console.log("Accès aux directives accordé");
      showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
      
      // Enregistrement de l'accès dans localStorage pour la session
      localStorage.setItem('directive_access_user_id', userId);
      localStorage.setItem('directive_access_timestamp', new Date().toISOString());
      
      // Navigation vers la page des directives après un court délai
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
      
      return { success: true };
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
      return {
        success: false,
        error: "Une erreur est survenue lors de la vérification de l'accès. Veuillez réessayer ou contacter le support."
      };
    }
  };

  return { handleFormSubmission };
};
