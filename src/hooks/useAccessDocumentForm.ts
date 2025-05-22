
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formSchema } from "@/utils/access-document/validationSchema";

// Define type for form data
export type FormData = z.infer<typeof formSchema>;

export const useAccessDocumentForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
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

  // Function to access directives (now redirects to login)
  const accessDirectives = async () => {
    if (!await handleFormValidation()) {
      console.log("Form is not valid");
      return { success: false, error: "Invalid form" };
    }
    
    setLoading(true);
    
    try {
      console.log("Direct access to documents has been disabled. Login required.");
      
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder à cette fonctionnalité",
        variant: "destructive"
      });
      
      navigate("/auth");
      return { success: false, error: "Login required" };
    } finally {
      setLoading(false);
    }
  };

  // Function to access medical data (now redirects to login)
  const accessMedicalData = async () => {
    if (!await handleFormValidation()) {
      console.log("Form is not valid");
      return { success: false, error: "Invalid form" };
    }
    
    setLoading(true);
    
    try {
      console.log("Direct access to documents has been disabled. Login required.");
      
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder à cette fonctionnalité",
        variant: "destructive"
      });
      
      navigate("/auth");
      return { success: false, error: "Login required" };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    accessDirectives,
    accessMedicalData
  };
};
