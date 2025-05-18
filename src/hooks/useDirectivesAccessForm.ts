
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

export type DirectivesFormData = z.infer<typeof formSchema>;

// Fonctions utilitaires pour les interactions avec la base de données
const checkDirectivesAccessCode = async (accessCode: string) => {
  console.log(`Vérification du code d'accès directives: ${accessCode}`);
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

const checkProfileMatch = async (userId: string, formData: DirectivesFormData) => {
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
  
  console.log(`Correspondance du profil directives: ${isMatch}`);
  
  return { isMatch, profile };
};

export const useDirectivesAccessForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Initialisation de react-hook-form avec le resolver zod
  const form = useForm<DirectivesFormData>({
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
        toast({
          title: "Accès refusé",
          description: "Code d'accès invalide",
          variant: "destructive"
        });
        return;
      }
      
      const userId = accessData[0].user_id;
      console.log("ID utilisateur récupéré:", userId);
      
      // Vérification des informations du profil
      const { isMatch } = await checkProfileMatch(userId, formData);
      
      if (!isMatch) {
        console.log("Informations personnelles incorrectes pour directives");
        toast({
          title: "Accès refusé",
          description: "Informations personnelles incorrectes",
          variant: "destructive"
        });
        return;
      }
      
      // Accès accordé
      console.log("Accès aux directives accordé");
      toast({
        title: "Accès autorisé",
        description: "Chargement des directives anticipées..."
      });
      
      // Navigation vers la page des directives après un court délai
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
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
    accessDirectives
  };
};
