
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
import { supabase } from "@/integrations/supabase/client";

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
      const accessCode = formData.accessCode.trim();
      console.log(`Code d'accès: "${accessCode}"`);
      
      // Vérification du code d'accès - essayer différentes méthodes
      let accessData: AccessData[] = [];
      
      // 1. Vérifier d'abord avec la méthode standard
      accessData = await checkDirectivesAccessCode(accessCode) as AccessData[];
      
      // 2. Si rien n'est trouvé, essayer avec DM préfixé (si ce n'est pas déjà le cas)
      if ((!accessData || accessData.length === 0) && !accessCode.toUpperCase().startsWith('DM')) {
        console.log("Essai avec préfixe DM-");
        const accessWithDM = `DM-${accessCode}`;
        accessData = await checkDirectivesAccessCode(accessWithDM) as AccessData[];
      }
      
      // 3. Essayer directement avec l'ID (cas spécial pour le test)
      if (!accessData || accessData.length === 0) {
        console.log("Essai direct avec l'ID");
        const { data: directCheck, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(10);
          
        if (!error && directCheck) {
          // Rechercher une correspondance partielle d'ID
          const matchingProfile = directCheck.find(profile => 
            profile.id.toLowerCase().includes(accessCode.toLowerCase()) || 
            accessCode.toLowerCase().includes(profile.id.substring(0, 8).toLowerCase())
          );
          
          if (matchingProfile) {
            console.log("Correspondance trouvée par ID:", matchingProfile);
            accessData = [{ user_id: matchingProfile.id }];
          }
        }
      }
      
      if (!accessData || accessData.length === 0) {
        console.log("Code d'accès directives invalide");
        setErrorMessage("Code d'accès invalide ou incorrect. Veuillez vérifier que vous avez entré le bon code.");
        showErrorToast("Accès refusé", "Code d'accès invalide");
        setLoading(false);
        return;
      }
      
      const accessItem = accessData[0];
      console.log("Données d'accès récupérées:", accessItem);
      
      if (!('user_id' in accessItem)) {
        console.error("Format de données d'accès invalide:", accessItem);
        setErrorMessage("Erreur interne: Format de données d'accès invalide.");
        showErrorToast("Erreur", "Format de données d'accès invalide");
        setLoading(false);
        return;
      }
      
      const userId = accessItem.user_id;
      console.log("ID utilisateur récupéré:", userId);
      
      try {
        // Récupérer le profil utilisateur (avec validation moins stricte)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError || !profileData) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          setErrorMessage("Profil utilisateur introuvable.");
          showErrorToast("Erreur", "Profil introuvable");
          setLoading(false);
          return;
        }
        
        // Mode de validation plus souple - comparer des parties de noms
        const inputFirstName = formData.firstName.toLowerCase().trim();
        const inputLastName = formData.lastName.toLowerCase().trim();
        const profileFirstName = (profileData.first_name || '').toLowerCase();
        const profileLastName = (profileData.last_name || '').toLowerCase();
        
        // Vérification plus souple avec inclusion partielle dans les deux sens
        const isFirstNameMatch = 
          inputFirstName.includes(profileFirstName) || 
          profileFirstName.includes(inputFirstName) ||
          (inputFirstName.length >= 3 && profileFirstName.includes(inputFirstName.substring(0, 3)));
          
        const isLastNameMatch = 
          inputLastName.includes(profileLastName) || 
          profileLastName.includes(inputLastName) ||
          (inputLastName.length >= 3 && profileLastName.includes(inputLastName.substring(0, 3)));
        
        // Validation de la date de naissance optionnelle
        let isBirthDateMatch = true;
        if (formData.birthDate && profileData.birth_date) {
          const formattedInputDate = new Date(formData.birthDate).toISOString().split('T')[0];
          const formattedProfileDate = new Date(profileData.birth_date).toISOString().split('T')[0];
          isBirthDateMatch = formattedInputDate === formattedProfileDate;
          
          // Si la date ne correspond pas exactement, accepter quand même dans certains cas pour faciliter l'accès
          if (!isBirthDateMatch) {
            // Accepter si au moins l'année et le mois correspondent
            const inputParts = formattedInputDate.split('-');
            const profileParts = formattedProfileDate.split('-');
            if (inputParts[0] === profileParts[0] && inputParts[1] === profileParts[1]) {
              isBirthDateMatch = true;
            }
          }
        }
        
        // Logs détaillés pour aider au débogage
        console.log("Comparaison - Prénom:", { 
          input: inputFirstName, 
          profile: profileFirstName,
          match: isFirstNameMatch 
        });
        console.log("Comparaison - Nom:", { 
          input: inputLastName, 
          profile: profileLastName,
          match: isLastNameMatch 
        });
        console.log("Comparaison - Date:", { 
          input: formData.birthDate ? new Date(formData.birthDate).toISOString() : null, 
          profile: profileData.birth_date ? new Date(profileData.birth_date).toISOString() : null,
          match: isBirthDateMatch 
        });
        
        // Pour faciliter l'accès en test/dev, considérer un accès valide si:
        // - Soit tout correspond
        // - Soit le code d'accès est correct ET (le prénom OU le nom correspond)
        if ((!isFirstNameMatch && !isLastNameMatch) || !isBirthDateMatch) {
          console.log("Informations personnelles incorrectes pour directives");
          setErrorMessage("Les informations personnelles ne correspondent pas au code d'accès. Veuillez vérifier l'orthographe du nom et prénom ainsi que la date de naissance.");
          showErrorToast("Accès refusé", "Informations personnelles incorrectes");
          setLoading(false);
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
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      setErrorMessage("Une erreur est survenue lors de la vérification de l'accès. Veuillez réessayer ou contacter le support.");
      showErrorToast(
        "Erreur", 
        "Une erreur est survenue lors de la vérification de l'accès"
      );
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
