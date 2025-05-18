
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

export type MedicalFormData = z.infer<typeof formSchema>;

// Fonction utilitaire pour vérifier le code d'accès médical
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
        toast({
          title: "Accès refusé",
          description: "Code d'accès médical invalide",
          variant: "destructive"
        });
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
        toast({
          title: "Accès refusé",
          description: "Informations personnelles incorrectes",
          variant: "destructive"
        });
        return;
      }
      
      // Accès accordé
      console.log("Accès aux données médicales accordé");
      toast({
        title: "Accès autorisé",
        description: "Chargement des données médicales..."
      });
      
      // Navigation vers la page des données médicales après un court délai
      setTimeout(() => {
        navigate('/donnees-medicales');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux données médicales:", error);
      toast({
        title: "Erreur", 
        description: "Une erreur est survenue lors de la vérification de l'accès",
        variant: "destructive"
      });
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
