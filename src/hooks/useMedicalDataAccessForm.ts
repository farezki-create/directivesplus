
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { checkMedicalAccessCode, showErrorToast, showSuccessToast } from "@/utils/accessUtils";
import { supabase } from "@/integrations/supabase/client";

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
      // Code d'accès (sera normalisé dans la fonction checkMedicalAccessCode)
      const accessCode = formData.accessCode;
      console.log(`Code d'accès médical: "${accessCode}"`);
      
      // Vérification du code d'accès médical
      const profilesData = await checkMedicalAccessCode(accessCode);
      
      if (!profilesData || profilesData.length === 0) {
        console.log("Code d'accès médical invalide");
        setErrorMessage("Code d'accès médical invalide ou incorrect. Veuillez vérifier que vous avez entré le bon code.");
        showErrorToast("Accès refusé", "Code d'accès médical invalide");
        return;
      }
      
      // On récupère les données initiales du profil
      let profileData = profilesData[0];
      console.log("Profil médical initial trouvé:", profileData);
      
      // Vérifier si le profil est un résultat spécial (format DM-)
      // Dans ce cas, on a seulement user_id et pas les autres propriétés
      if ('user_id' in profileData && !('first_name' in profileData)) {
        console.log("Format spécial détecté (DM-), récupération du profil complet");
        const userId = profileData.user_id;
        
        // Il faut récupérer les détails du profil complet avec l'ID utilisateur
        const { data: completeProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error || !completeProfile) {
          console.error("Erreur lors de la récupération du profil complet:", error);
          setErrorMessage("Une erreur est survenue lors de la vérification de l'accès. Profil utilisateur introuvable.");
          showErrorToast("Erreur", "Profil utilisateur introuvable");
          return;
        }
        
        // Utiliser le profil complet à la place du profil partiel
        profileData = completeProfile;
        console.log("Profil complet récupéré:", profileData);
      }
      
      // S'assurer que le profil a les propriétés nécessaires
      if (!('first_name' in profileData) || !('last_name' in profileData)) {
        console.error("Le profil ne contient pas les informations requises");
        setErrorMessage("Les informations de profil sont incomplètes. Veuillez contacter le support.");
        showErrorToast("Erreur", "Profil incomplet");
        return;
      }
      
      // Normaliser les données pour la comparaison (insensible à la casse)
      const normalizedFirstName = formData.firstName.toLowerCase().trim();
      const normalizedLastName = formData.lastName.toLowerCase().trim();
      const profileFirstName = (profileData.first_name || '').toLowerCase().trim();
      const profileLastName = (profileData.last_name || '').toLowerCase().trim();
      
      // Vérifier la date de naissance si elle est fournie
      const birthDateMatch = formData.birthDate ? 
        ('birth_date' in profileData && new Date(profileData.birth_date).toISOString().split('T')[0] === formData.birthDate) : true;
      
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
