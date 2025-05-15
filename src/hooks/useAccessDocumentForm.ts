
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define zod schema for form validation
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type FormData = z.infer<typeof formSchema>;

// Extracted function for checking access code in document_access_codes
const checkDirectivesAccessCode = async (accessCode: string) => {
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('user_id')
    .eq('access_code', accessCode.trim());
    
  if (error) throw error;
  return data;
};

// Extracted function for checking user profile match
const checkProfileMatch = async (userId: string, formData: FormData) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
  
  if (error) throw error;
  
  if (!data || data.length === 0) {
    throw new Error("Profil utilisateur introuvable");
  }
  
  const profile = data[0];
  const birthDateMatch = formData.birthDate ? 
    new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
  
  const isMatch = profile.first_name.toLowerCase() === formData.firstName.toLowerCase() && 
                  profile.last_name.toLowerCase() === formData.lastName.toLowerCase() &&
                  birthDateMatch;
                  
  return { isMatch, profile };
};

// Extracted function for checking medical access code
const checkMedicalAccessCode = async (accessCode: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('medical_access_code', accessCode.trim());
  
  if (error) throw error;
  return data;
};

// Toast notification handlers
const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};

const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};

export const useAccessDocumentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  const handleFormValidation = async () => {
    const isValid = await form.trigger();
    if (!isValid) return false;
    return true;
  };

  const accessDirectives = async () => {
    if (!await handleFormValidation()) return;
    
    const formData = form.getValues();
    
    setLoading(true);
    try {
      // Check if access code exists
      const accessData = await checkDirectivesAccessCode(formData.accessCode);
      
      if (!accessData || accessData.length === 0) {
        showErrorToast("Accès refusé", "Code d'accès invalide");
        return;
      }
      
      const userId = accessData[0].user_id;
      
      // Check if profile info matches
      const { isMatch } = await checkProfileMatch(userId, formData);
      
      if (!isMatch) {
        showErrorToast("Accès refusé", "Informations personnelles incorrectes");
        return;
      }
      
      // Access granted
      showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
      
      // Navigate to directives page after a short delay
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
    } finally {
      setLoading(false);
    }
  };

  const accessMedicalData = async () => {
    if (!await handleFormValidation()) return;
    
    const formData = form.getValues();
    
    setLoading(true);
    try {
      // Check if medical access code exists
      const profilesData = await checkMedicalAccessCode(formData.accessCode);
      
      if (!profilesData || profilesData.length === 0) {
        showErrorToast("Accès refusé", "Code d'accès médical invalide");
        return;
      }
      
      const profile = profilesData[0];
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profile.first_name.toLowerCase() !== formData.firstName.toLowerCase() || 
          profile.last_name.toLowerCase() !== formData.lastName.toLowerCase() ||
          !birthDateMatch) {
        showErrorToast("Accès refusé", "Informations personnelles incorrectes");
        return;
      }
      
      // Access granted
      showSuccessToast("Accès autorisé", "Chargement des données médicales...");
      
      // Navigate to medical data page after a short delay
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
    form,
    loading,
    accessDirectives,
    accessMedicalData
  };
};
