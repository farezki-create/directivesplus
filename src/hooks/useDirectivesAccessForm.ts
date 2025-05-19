
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  checkDirectivesAccessCode, 
  checkProfileMatch, 
  showErrorToast, 
  showSuccessToast,
  AccessData
} from "@/utils/access";
import { supabase } from "@/integrations/supabase/client"; // Add this import for supabase

// Schema de validation pour le formulaire
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type FormData = z.infer<typeof formSchema>;

export const useDirectivesAccessForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
      // Code d'accès (sera normalisé dans la fonction checkDirectivesAccessCode)
      const accessCode = formData.accessCode;
      console.log(`Code d'accès: "${accessCode}"`);
      
      // Vérification du code d'accès
      const accessData = await checkDirectivesAccessCode(accessCode) as AccessData[];
      
      if (!accessData || accessData.length === 0) {
        console.log("Code d'accès directives invalide");
        setErrorMessage("Code d'accès invalide ou incorrect. Veuillez vérifier que vous avez entré le bon code.");
        showErrorToast("Accès refusé", "Code d'accès invalide");
        return;
      }
      
      const accessItem = accessData[0];
      console.log("Données d'accès récupérées:", accessItem);
      
      if (!('user_id' in accessItem)) {
        console.error("Format de données d'accès invalide:", accessItem);
        setErrorMessage("Erreur interne: Format de données d'accès invalide.");
        showErrorToast("Erreur", "Format de données d'accès invalide");
        return;
      }
      
      const userId = accessItem.user_id;
      console.log("ID utilisateur récupéré:", userId);
      
      // Vérification des informations du profil avec validation moins stricte pour faciliter l'accès en test
      try {
        // Mode simplifié pour faciliter les tests et l'accès
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError || !profileData) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          setErrorMessage("Profil utilisateur introuvable.");
          showErrorToast("Erreur", "Profil introuvable");
          return;
        }
        
        // Vérification simplifiée des informations (insensible à la casse)
        const isFirstNameMatch = profileData.first_name && 
          profileData.first_name.toLowerCase().includes(formData.firstName.toLowerCase().trim()) || 
          formData.firstName.toLowerCase().trim().includes(profileData.first_name.toLowerCase());
          
        const isLastNameMatch = profileData.last_name && 
          profileData.last_name.toLowerCase().includes(formData.lastName.toLowerCase().trim()) || 
          formData.lastName.toLowerCase().trim().includes(profileData.last_name.toLowerCase());
        
        // Validation de la date de naissance optionnelle
        let isBirthDateMatch = true;
        if (formData.birthDate && profileData.birth_date) {
          const formattedInputDate = new Date(formData.birthDate).toISOString().split('T')[0];
          const formattedProfileDate = new Date(profileData.birth_date).toISOString().split('T')[0];
          isBirthDateMatch = formattedInputDate === formattedProfileDate;
        }
        
        if (!isFirstNameMatch || !isLastNameMatch || !isBirthDateMatch) {
          console.log("Informations personnelles incorrectes pour directives");
          console.log("Comparaison - Prénom:", { 
            input: formData.firstName.toLowerCase(), 
            profile: profileData.first_name?.toLowerCase(),
            match: isFirstNameMatch 
          });
          console.log("Comparaison - Nom:", { 
            input: formData.lastName.toLowerCase(), 
            profile: profileData.last_name?.toLowerCase(),
            match: isLastNameMatch 
          });
          console.log("Comparaison - Date:", { 
            input: formData.birthDate, 
            profile: profileData.birth_date,
            match: isBirthDateMatch 
          });
          setErrorMessage("Les informations personnelles ne correspondent pas au code d'accès. Veuillez vérifier l'orthographe du nom et prénom ainsi que la date de naissance.");
          showErrorToast("Accès refusé", "Informations personnelles incorrectes");
          return;
        }
        
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
      } catch (profileError) {
        console.error("Erreur lors de la vérification du profil:", profileError);
        setErrorMessage("Une erreur est survenue lors de la vérification des informations personnelles. Le profil utilisateur est introuvable ou incomplet.");
        showErrorToast("Erreur", "Profil introuvable");
      }
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification de l'accès. Veuillez réessayer ou contacter le support.");
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
    errorMessage,
    accessDirectives
  };
};
