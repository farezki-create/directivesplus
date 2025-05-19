
import { useState } from "react";
import { useDirectivesFormValidation } from "./form-validation";
import { useFormSubmission } from "./form-submission";
import { DirectivesFormData } from "./types";

export const useDirectivesAccessForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { form, handleFormValidation } = useDirectivesFormValidation();
  const { handleFormSubmission } = useFormSubmission();

  // Fonction d'accès aux directives
  const accessDirectives = async () => {
    setErrorMessage(null);
    
    if (!await handleFormValidation()) {
      console.log("Le formulaire directives n'est pas valide");
      return;
    }
    
    const formData = form.getValues();
    setLoading(true);
    
    try {
      const result = await handleFormSubmission(formData);
      
      if (!result.success) {
        setErrorMessage(result.error);
      }
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
