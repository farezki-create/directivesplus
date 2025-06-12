
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "./ProfileForm";

interface UseProfileSubmitProps {
  profileId: string;
  onProfileUpdate: (updatedProfile: any) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useProfileSubmit({ 
  profileId, 
  onProfileUpdate, 
  setIsLoading 
}: UseProfileSubmitProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitProgress, setSubmitProgress] = useState(0);

  const submitProfile = async (values: ProfileFormValues) => {
    try {
      console.log('🔄 [PROFILE-SUBMIT] Début soumission:', values);
      
      setFormState('submitting');
      setIsLoading(true);
      
      // Animation de progression
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSubmitProgress(progress > 90 ? 90 : progress);
      }, 100);
      
      // Formatage de la date de naissance pour la base de données
      const formattedBirthDate = values.birthDate ? 
        values.birthDate.toISOString().split('T')[0] : null;

      console.log('📝 [PROFILE-SUBMIT] Données formatées:', {
        ...values,
        birthDate: formattedBirthDate
      });

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          birth_date: formattedBirthDate,
          phone_number: values.phoneNumber || null,
          address: values.address || null,
          city: values.city || null,
          postal_code: values.postalCode || null,
          country: values.country || null,
        })
        .eq("id", profileId);

      clearInterval(interval);
      setSubmitProgress(100);
      
      if (error) {
        console.error('❌ [PROFILE-SUBMIT] Erreur Supabase:', error);
        setFormState('error');
        toast.error("Erreur lors de la mise à jour du profil", {
          description: error.message,
        });
        return;
      }

      setFormState('success');
      toast.success("Profil mis à jour avec succès", {
        description: "Vos informations ont été sauvegardées",
      });
      
      // Mettre à jour l'état parent
      onProfileUpdate({
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: formattedBirthDate,
        phone_number: values.phoneNumber,
        address: values.address,
        city: values.city,
        postal_code: values.postalCode,
        country: values.country,
      });
      
      console.log('✅ [PROFILE-SUBMIT] Mise à jour réussie');
      
      // Reset après succès
      setTimeout(() => {
        setFormState('idle');
        setSubmitProgress(0);
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ [PROFILE-SUBMIT] Erreur inattendue:', error);
      setFormState('error');
      toast.error("Une erreur est survenue", {
        description: error.message || "Veuillez réessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitProfile,
    formState,
    submitProgress
  };
}
