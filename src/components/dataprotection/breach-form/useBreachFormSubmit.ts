
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { reportDataBreach } from "@/utils/dataBreachUtils";
import { FormSchema } from './types';

export const useBreachFormSubmit = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormSchema) => {
    setIsSubmitting(true);
    try {
      // Convert affected_users_count to number if provided
      const affectedUsersCount = values.affected_users_count ? 
        parseInt(values.affected_users_count, 10) : undefined;
      
      // Create a notification object with all required properties explicitly assigned
      const notificationData = {
        breach_type: values.breach_type,
        description: values.description,
        affected_data_types: values.affected_data_types,
        affected_users_count: affectedUsersCount,
        detection_date: values.detection_date,
        remediation_measures: values.remediation_measures,
        is_notified_to_authorities: values.is_notified_to_authorities,
        is_notified_to_users: values.is_notified_to_users,
        reporter_name: values.reporter_name,
        reporter_email: values.reporter_email,
        risk_level: values.risk_level,
        is_data_encrypted: values.is_data_encrypted
      };
      
      const success = await reportDataBreach(notificationData);
      
      if (success) {
        toast({
          title: "Signalement enregistré",
          description: "La violation de données a été correctement signalée et sera traitée par l'équipe de sécurité.",
          duration: 5000,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du signalement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du signalement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
