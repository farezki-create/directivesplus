
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validation pour le formulaire
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type FormData = z.infer<typeof formSchema>;

// Fonctions utilitaires pour les interactions avec la base de données
const checkDirectivesAccessCode = async (accessCode: string) => {
  console.log(`Vérification du code d'accès: ${accessCode}`);
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('user_id')
    .eq('access_code', accessCode.trim());
    
  if (error) {
    console.error("Erreur lors de la vérification du code d'accès:", error);
    throw error;
  }
  
  console.log(`Résultat de la vérification:`, data);
  return data;
};

const checkProfileMatch = async (userId: string, formData: FormData) => {
  console.log(`Vérification du profil pour l'utilisateur: ${userId}`);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
  
  if (error) {
    console.error("Erreur lors de la vérification du profil:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.error("Profil utilisateur introuvable");
    throw new Error("Profil utilisateur introuvable");
  }
  
  const profile = data[0];
  console.log("Profil trouvé:", profile);
  
  const birthDateMatch = formData.birthDate ? 
    new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
  
  const isMatch = profile.first_name.toLowerCase() === formData.firstName.toLowerCase() && 
                  profile.last_name.toLowerCase() === formData.lastName.toLowerCase() &&
                  birthDateMatch;
  
  console.log(`Correspondance du profil: ${isMatch}`);
  
  return { isMatch, profile };
};

const checkMedicalAccessCode = async (accessCode: string) => {
  console.log(`Vérification du code d'accès médical: ${accessCode}`);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('medical_access_code', accessCode.trim());
  
  if (error) {
    console.error("Erreur lors de la vérification du code d'accès médical:", error);
    throw error;
  }
  
  console.log(`Résultat de la vérification médicale:`, data);
  return data;
};

// Gestionnaires de notifications toast
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
    console.log("Données du formulaire pour directives:", formData);
    
    setLoading(true);
    try {
      // Vérification du code d'accès
      const accessData = await checkDirectivesAccessCode(formData.accessCode);
      
      if (!accessData || accessData.length === 0) {
        console.log("Code d'accès invalide");
        showErrorToast("Accès refusé", "Code d'accès invalide");
        return;
      }
      
      const userId = accessData[0].user_id;
      console.log("ID utilisateur récupéré:", userId);
      
      // Vérification des informations du profil
      const { isMatch } = await checkProfileMatch(userId, formData);
      
      if (!isMatch) {
        console.log("Informations personnelles incorrectes");
        showErrorToast("Accès refusé", "Informations personnelles incorrectes");
        return;
      }
      
      // Accès accordé
      console.log("Accès aux directives accordé");
      showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
      
      // Navigation vers la page des directives après un court délai
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

  // Fonction d'accès aux données médicales
  const accessMedicalData = async () => {
    if (!await handleFormValidation()) {
      console.log("Le formulaire n'est pas valide");
      return;
    }
    
    const formData = form.getValues();
    console.log("Données du formulaire pour données médicales:", formData);
    
    setLoading(true);
    try {
      // Vérification du code d'accès médical
      const profilesData = await checkMedicalAccessCode(formData.accessCode);
      
      if (!profilesData || profilesData.length === 0) {
        console.log("Code d'accès médical invalide");
        showErrorToast("Accès refusé", "Code d'accès médical invalide");
        return;
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
        return;
      }
      
      // Accès accordé
      console.log("Accès aux données médicales accordé");
      showSuccessToast("Accès autorisé", "Chargement des données médicales...");
      
      // Navigation vers la page des données médicales après un court délai
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
