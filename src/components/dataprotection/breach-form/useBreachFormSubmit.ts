
import { useState } from "react";
import { FormSchema } from "./types";
import { toast } from "@/hooks/use-toast";
import { reportDataBreach } from "@/utils/data-breach";

/**
 * Hook personnalisé pour gérer la soumission du formulaire de signalement de violation
 * @param onSuccessCallback Fonction à exécuter en cas de succès
 */
export const useBreachFormSubmit = (onSuccessCallback?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data: FormSchema) => {
    setIsSubmitting(true);
    try {
      
      
      const notificationData = {
        breach_type: data.breach_type,
        description: data.description,
        affected_data_types: data.affected_data_types,
        affected_users_count: data.affected_users_count ? parseInt(data.affected_users_count) : undefined,
        detection_date: data.detection_date,
        remediation_measures: data.remediation_measures,
        is_notified_to_authorities: data.is_notified_to_authorities,
        is_notified_to_users: data.is_notified_to_users,
        reporter_name: data.reporter_name,
        reporter_email: data.reporter_email,
        risk_level: data.risk_level,
        is_data_encrypted: data.is_data_encrypted
      };

      const result = await reportDataBreach(notificationData);
      
      if (result) {
        toast({
          title: "Signalement envoyé avec succès",
          description: "La violation de données a été correctement signalée.",
        });
        
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      }
    } catch (error) {
      console.error("Erreur lors du signalement de la violation:", error);
      toast({
        title: "Erreur lors du signalement",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};
