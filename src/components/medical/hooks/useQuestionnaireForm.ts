
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  medicalQuestionnaireSchema,
  MedicalQuestionnaireData 
} from "../schemas/medicalQuestionnaireSchema";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for creating and managing the medical questionnaire form
 */
export function useQuestionnaireForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<MedicalQuestionnaireData>({
    resolver: zodResolver(medicalQuestionnaireSchema),
    defaultValues: {
      symptomes: [],
      famille: [],
      pathologies: [],
      chirurgies: [],
      allergies: [],
      dispositifs: "",
    },
  });

  // Récupérer les données déjà enregistrées pour l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Récupérer les données du profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
        } else if (profileData) {
          form.setValue('nom', profileData.last_name || '');
          form.setValue('prenom', profileData.first_name || '');
          form.setValue('date_naissance', profileData.birth_date || '');
          form.setValue('adresse', profileData.address || '');
          form.setValue('telephone', profileData.phone_number || '');
          
          // Notification pour informer l'utilisateur
          toast({
            title: "Informations récupérées",
            description: "Vos données personnelles ont été automatiquement remplies.",
          });
        }
        
        // Récupérer les données médicales existantes
        const { data: medicalData, error: medicalError } = await supabase
          .from('medical_data')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (medicalError) {
          console.error("Erreur lors de la récupération des données médicales:", medicalError);
        } else if (medicalData && medicalData.length > 0) {
          const latestData = medicalData[0];
          // Les données sont cryptées, donc on ne peut pas les utiliser directement
          // Cette partie est juste pour illustration
          console.log("Données médicales existantes trouvées:", latestData.id);
          
          // Note: Pour utiliser réellement ces données, il faudrait les décrypter côté serveur
          // et les renvoyer au client de manière sécurisée
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, form, toast]);

  return { form, isLoading };
}
