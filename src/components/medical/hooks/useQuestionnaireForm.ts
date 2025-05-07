
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  medicalQuestionnaireSchema,
  MedicalQuestionnaireData,
  dispositifsList 
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
      pathologies: [],
      chirurgies: [],
      allergies: [],
      famille: [],
      dispositifs: "",
      tabac: false,
      alcool: false,
      drogues: false,
      activite_physique: false
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
          // Remplir automatiquement les données du profil
          form.setValue('nom', profileData.last_name || '');
          form.setValue('prenom', profileData.first_name || '');
          form.setValue('date_naissance', profileData.birth_date || '');
          form.setValue('adresse', profileData.address || '');
          form.setValue('telephone', profileData.phone_number || '');
          
          toast({
            title: "Informations récupérées",
            description: "Vos données personnelles ont été automatiquement remplies",
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
          
          try {
            // Essayer de parser les données JSON
            if (latestData.data) {
              const parsedData = typeof latestData.data === 'string' 
                ? JSON.parse(latestData.data) 
                : latestData.data;
              
              if (parsedData) {
                // Remplir le formulaire avec les données médicales existantes
                if (parsedData.allergies) form.setValue('allergies', parsedData.allergies);
                if (parsedData.pathologies) form.setValue('pathologies', parsedData.pathologies);
                if (parsedData.chirurgies) form.setValue('chirurgies', parsedData.chirurgies);
                if (parsedData.famille) form.setValue('famille', parsedData.famille);
                if (parsedData.dispositifs) form.setValue('dispositifs', parsedData.dispositifs);
                if (parsedData.tabac !== undefined) form.setValue('tabac', parsedData.tabac);
                if (parsedData.alcool !== undefined) form.setValue('alcool', parsedData.alcool);
                if (parsedData.drogues !== undefined) form.setValue('drogues', parsedData.drogues);
                if (parsedData.activite_physique !== undefined) form.setValue('activite_physique', parsedData.activite_physique);
                
                toast({
                  title: "Données médicales récupérées",
                  description: "Vos données médicales ont été automatiquement remplies",
                });
              }
            }
          } catch (parseError) {
            console.error("Erreur lors du parsing des données médicales:", parseError);
          }
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
