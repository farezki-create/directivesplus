
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessDirectives } from "./access-document/useDirectivesAccess";
import { useMedicalAccess, MedicalAccessResult } from "./access-document/useMedicalAccess";
import { formSchema, FormData } from "@/utils/access-document/validationSchema";

export const useAccessDocumentForm = () => {
  const [loading, setLoading] = useState(false);
  const medicalAccess = useMedicalAccess();
  
  // Initialize react-hook-form with zod resolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // Form validation function
  const handleFormValidation = async () => {
    const isValid = await form.trigger();
    console.log("Form validation:", isValid);
    return isValid;
  };

  // Function to access directives
  const accessDirectivesFunc = async () => {
    if (!await handleFormValidation()) {
      console.log("Form is not valid");
      return;
    }
    
    const formData = form.getValues();
    setLoading(true);
    
    try {
      return await accessDirectives(formData);
    } finally {
      setLoading(false);
    }
  };

  // Function to access medical data
  const accessMedicalData = async (): Promise<MedicalAccessResult> => {
    if (!await handleFormValidation()) {
      console.log("Form is not valid");
      return { success: false, error: "Invalid form" };
    }
    
    const formData = form.getValues();
    setLoading(true);
    
    try {
      return await medicalAccess.accessMedicalData(formData);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading: loading || medicalAccess.loading,
    accessDirectives: accessDirectivesFunc,
    accessMedicalData
  };
};
