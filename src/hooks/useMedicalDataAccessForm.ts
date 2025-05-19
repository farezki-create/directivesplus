
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
    setErrorMessage(null);
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
      // Normaliser le code d'accès (suppression des espaces)
      const normalizedCode = formData.accessCode.trim();
      console.log(`Code d'accès médical normalisé: "${normalizedCode}"`);
      
      // Vérification du code d'accès médical
      const profilesData = await checkMedicalAccessCode(normalizedCode);
      
      if (!profilesData || profilesData.length === 0) {
        console.log("Code d'accès médical invalide");
        setErrorMessage("Code d'accès médical invalide ou incorrect. Veuillez vérifier que vous avez entré le bon code.");
        showErrorToast("Accès refusé", "Code d'accès médical invalide");
        return;
      }
      
      const profile = profilesData[0];
      console.log("Profil médical trouvé:", profile);
      
      // Normaliser les données pour la comparaison (insensible à la casse)
      const normalizedFirstName = formData.firstName.toLowerCase().trim();
      const normalizedLastName = formData.lastName.toLowerCase().trim();
      const profileFirstName = (profile.first_name || '').toLowerCase().trim();
      const profileLastName = (profile.last_name || '').toLowerCase().trim();
      
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profileFirstName !== normalizedFirstName || 
          profileLastName !== normalizedLastName ||
          !birthDateMatch) {
        console.log("Informations personnelles médicales incorrectes");
        setErrorMessage("Les informations personnelles ne correspondent pas au code d'accès. Veuillez vérifier l'orthographe du nom et prénom ainsi que la date de naissance.");
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
    accessMedicalData
  };
};
