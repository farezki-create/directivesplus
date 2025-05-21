
import { supabase } from "@/integrations/supabase/client";
import { BreachLogData } from "./types";

/**
 * Enregistre un log de violation pour des événements de sécurité
 * @param data Les détails du log
 */
export const logBreachEvent = async (data: BreachLogData): Promise<void> => {
  try {
    // Récupérer l'utilisateur connecté si disponible
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insérer dans la table document_access_logs
    await supabase
      .from('document_access_logs')
      .insert({
        user_id: data.user_id || user?.id || '00000000-0000-0000-0000-000000000000',
        access_code_id: 'security_log',
        nom_consultant: 'System',
        prenom_consultant: 'Security',
        ip_address: 'internal',
        user_agent: `SECURITY_LOG | Type: ${data.breach_type} | Risk: ${data.risk_level} | Details: ${JSON.stringify(data.details).substring(0, 200)}`
      });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du log de sécurité:", error);
  }
};
