
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  checkDirectivesAccessCode, 
  checkProfileMatch, 
  showErrorToast, 
  showSuccessToast 
} from "@/utils/accessUtils";

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
      // Vérification du code d'accès
      const accessData = await checkDirectivesAccessCode(formData.accessCode);
      
      if (!accessData || accessData.length === 0) {
        console.log("Code d'accès directives invalide");
        showErrorToast("Accès refusé", "Code d'accès invalide");
        return;
      }
      
      const userId = accessData[0].user_id;
      console.log("ID utilisateur récupéré:", userId);
      
      // Vérification des informations du profil
      const { isMatch } = await checkProfileMatch(userId, formData);
      
      if (!isMatch) {
        console.log("Informations personnelles incorrectes pour directives");
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

  return {
    form,
    loading,
    accessDirectives
  };
};
