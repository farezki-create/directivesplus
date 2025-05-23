import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessCode: z.string().min(6, "Le code d'accès doit contenir au moins 6 caractères"),
});

type FormData = z.infer<typeof formSchema>;

export const useDirectivesAccessForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [blockedAccess, setBlockedAccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const values = form.getValues();
      console.log("Form submission with values:", values);
      
      // Since we're keeping only institution access, redirect to institution access page
      window.location.href = '/acces-institution';
      
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrorMessage("Une erreur est survenue lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    setLoading,
    handleSubmit,
    errorMessage,
    remainingAttempts,
    blockedAccess
  };
};
