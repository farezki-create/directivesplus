
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { checkMedicalAccessCode, showErrorToast, showSuccessToast } from "@/utils/accessUtils";

// Schema de validation pour le formulaire
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type MedicalFormData = z.infer<typeof formSchema>;

export const useMedicalDataAccessForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Initialisation de react-hook-form avec le resolver zod
  const form = useForm<MedicalFormData>({
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
    console.log("Validation du formulaire médical:", isValid);
    return isValid;
  };

  // Fonction d'accès aux données médicales
  const accessMedicalData = async () => {
    if (!await handleFormValidation()) {
      console.log("Le formulaire médical n'est pas valide");
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
    accessMedicalData
  };
};
