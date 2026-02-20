
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitProgress, setSubmitProgress] = useState(0);

  const submitProfile = async (values: ProfileFormValues) => {
    try {
      setFormState('submitting');
      setIsLoading(true);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSubmitProgress(progress > 90 ? 90 : progress);
      }, 100);
      
      const formattedBirthDate = values.birthDate ? 
        values.birthDate.toISOString().split('T')[0] : null;

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
        console.error('Erreur Supabase:', error);
        setFormState('error');
        toast.error("Erreur lors de la mise à jour du profil", {
          description: error.message,
        });
        return;
      }

      setFormState('success');
      toast.success("Profil mis à jour avec succès");
      
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
      
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('Erreur inattendue:', error);
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
