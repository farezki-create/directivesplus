
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
      
      // Vérification des informations du profil
      try {
        const { isMatch, profile } = await checkProfileMatch(userId, formData);
        
        if (!isMatch) {
          console.log("Informations personnelles incorrectes pour directives");
          setErrorMessage("Les informations personnelles ne correspondent pas au code d'accès. Veuillez vérifier l'orthographe du nom et prénom ainsi que la date de naissance.");
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
