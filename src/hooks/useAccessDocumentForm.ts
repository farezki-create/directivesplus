
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDirectivesAccess } from "./access-document/useDirectivesAccess";
import { useMedicalAccess } from "./access-document/useMedicalAccess";
import { formSchema, FormData } from "@/utils/access-document/validationSchema";

export const useAccessDocumentForm = () => {
  const [loading, setLoading] = useState(false);
  const directivesAccess = useDirectivesAccess();
  const medicalAccess = useMedicalAccess();
  
  // Initialisation de react-hook-form avec le resolver zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // Fonction de validation du formulaire
  const handleFormValidation = async () => {
    const isValid = await form.trigger();
    console.log("Validation du formulaire:", isValid);
    return isValid;
  };

  // Fonction d'accès aux directives
  const accessDirectives = async () => {
    if (!await handleFormValidation()) {
      console.log("Le formulaire n'est pas valide");
      return;
    }
    
    const formData = form.getValues();
    setLoading(true);
    
    try {
      await directivesAccess.accessDirectives(formData);
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'accès aux données médicales
  const accessMedicalData = async () => {
    if (!await handleFormValidation()) {
      console.log("Le formulaire n'est pas valide");
      return;
    }
    
    const formData = form.getValues();
    setLoading(true);
    
    try {
      await medicalAccess.accessMedicalData(formData);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading: loading || directivesAccess.loading || medicalAccess.loading,
    accessDirectives,
    accessMedicalData
  };
};
