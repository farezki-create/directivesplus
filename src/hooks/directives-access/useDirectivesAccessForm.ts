
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showSuccessToast, showErrorToast } from "@/utils/access";
import { directivesFormSchema, DirectivesFormData } from "./types";
import { verifyDirectivesAccess } from "./verification";

export const useDirectivesAccessForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Initialisation de react-hook-form avec le resolver zod
  const form = useForm<DirectivesFormData>({
    resolver: zodResolver(directivesFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // Fonction de validation du formulaire
  const handleFormValidation = async () => {
    setErrorMessage(null);
    const isValid = await form.trigger();
    console.log("Validation du formulaire directives:", isValid);
    return isValid;
  };

  // Fonction d'accès aux directives
  const accessDirectives = async () => {
    if (!await handleFormValidation()) {
      console.log("Le formulaire directives n'est pas valide");
      return;
    }
    
    const formData = form.getValues();
    console.log("Données du formulaire pour directives:", formData);
    
    setLoading(true);
    try {
      const verificationResult = await verifyDirectivesAccess(formData);
      
      if (!verificationResult.isValid) {
        setErrorMessage(verificationResult.error || "Erreur d'accès aux directives");
        setLoading(false);
        return;
      }
      
      const userId = verificationResult.userId;
      
      // Accès accordé
      console.log("Accès aux directives accordé");
      showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
      
      // Enregistrement de l'accès dans localStorage pour la session
      localStorage.setItem('directive_access_user_id', userId as string);
      localStorage.setItem('directive_access_timestamp', new Date().toISOString());
      
      // Navigation vers la page des directives après un court délai
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
      
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification de l'accès. Veuillez réessayer ou contacter le support.");
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    errorMessage,
    accessDirectives
  };
};

export default useDirectivesAccessForm;
