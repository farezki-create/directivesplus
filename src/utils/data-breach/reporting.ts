
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DataBreachNotification } from "./types";

/**
 * Enregistre une notification de violation dans le système
 * @param notification Les détails de la violation
 * @returns Promise avec le statut de l'opération
 */
export const reportDataBreach = async (notification: DataBreachNotification): Promise<boolean> => {
  try {
    // Récupérer l'utilisateur connecté si disponible
    const { data: { user } } = await supabase.auth.getUser();
    
    // Préparer les données à insérer en transformant certains champs
    const breachData = {
      breach_type: notification.breach_type,
      description: notification.description,
      affected_data: JSON.stringify(notification.affected_data_types),
      detection_date: notification.detection_date,
      remediation_measures: notification.remediation_measures,
      notified_to_authorities: notification.is_notified_to_authorities,
      notified_to_users: notification.is_notified_to_users,
      reporter_name: notification.reporter_name,
      reporter_email: notification.reporter_email,
      risk_level: notification.risk_level,
      affected_users_count: notification.affected_users_count || 0,
      status: 'reported',
      user_id: user?.id,
      // Utilisation temporaire du user_agent pour stocker des métadonnées additionnelles
      user_agent: `Data Breach Report | RiskLevel: ${notification.risk_level}`
    };
    
    // Insérer dans la table document_access_logs jusqu'à la création d'une table dédiée
    const { error } = await supabase
      .from('document_access_logs')
      .insert({
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        access_code_id: 'breach_notification',
        nom_consultant: notification.reporter_name,
        prenom_consultant: 'Security',
        ip_address: 'internal',
        user_agent: `SECURITY_BREACH | Type: ${notification.breach_type} | Risk: ${notification.risk_level} | Details: ${notification.description.substring(0, 200)}`
      });
      
    if (error) {
      console.error("Erreur lors de l'enregistrement de la violation:", error);
      throw error;
    }
    
    toast({
      title: "Signalement enregistré",
      description: "La violation de données a été correctement signalée et sera traitée par l'équipe de sécurité.",
      duration: 5000,
    });
    
    return true;
  } catch (error: any) {
    console.error("Erreur lors du signalement de la violation:", error);
    
    toast({
      title: "Erreur de signalement",
      description: "Impossible d'enregistrer le signalement. Veuillez réessayer ou contacter l'équipe de sécurité directement.",
      variant: "destructive",
    });
    
    return false;
  }
};
