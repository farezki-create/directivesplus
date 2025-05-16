import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Interface pour les données de notification de violation
 */
export interface DataBreachNotification {
  breach_type: "confidentiality" | "integrity" | "availability" | "multiple";
  description: string;
  affected_data_types: string[];
  affected_users_count?: number;
  detection_date: string;
  remediation_measures: string;
  is_notified_to_authorities: boolean;
  is_notified_to_users: boolean;
  reporter_name: string;
  reporter_email: string;
  risk_level: "low" | "medium" | "high" | "critical";
  is_data_encrypted?: boolean;
}

/**
 * Interface pour les logs de violation
 */
interface BreachLogData {
  user_id?: string;
  breach_type: string;
  description: string;
  affected_data: string;
  details: any;
  risk_level: string;
}

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
      // jusqu'à la mise à jour des types
      user_agent: `Data Breach Report | RiskLevel: ${notification.risk_level}`
    };
    
    // Insérer dans la table document_access_logs jusqu'à la création d'une table dédiée
    // Cela nous permet de centraliser les logs de sécurité
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

/**
 * Évalue si une notification aux autorités est nécessaire
 * @param riskLevel Le niveau de risque de la violation
 * @param dataTypes Les types de données concernées
 * @returns Un booléen indiquant si la notification est nécessaire
 */
export const evaluateAuthorityNotificationNeeded = (
  riskLevel: "low" | "medium" | "high" | "critical",
  dataTypes: string[]
): boolean => {
  // Les violations à risque moyen, élevé ou critique nécessitent une notification
  if (riskLevel === "medium" || riskLevel === "high" || riskLevel === "critical") {
    return true;
  }
  
  // Si des données de santé ou des directives anticipées sont concernées, notification obligatoire
  if (
    dataTypes.includes("health_data") || 
    dataTypes.includes("advance_directives") || 
    dataTypes.includes("medical_documents")
  ) {
    return true;
  }
  
  return false;
};

/**
 * Évalue si une notification aux personnes concernées est nécessaire
 * @param riskLevel Le niveau de risque de la violation
 * @param dataTypes Les types de données concernées
 * @param isEncrypted Indique si les données étaient chiffrées
 * @returns Un booléen indiquant si la notification est nécessaire
 */
export const evaluateUserNotificationNeeded = (
  riskLevel: "low" | "medium" | "high" | "critical",
  dataTypes: string[],
  isEncrypted: boolean
): boolean => {
  // Si les données étaient correctement chiffrées, pas de notification nécessaire
  if (isEncrypted) {
    return false;
  }
  
  // Les violations à risque élevé ou critique nécessitent une notification
  if (riskLevel === "high" || riskLevel === "critical") {
    return true;
  }
  
  // Si des données sensibles sont concernées avec un risque moyen, notification nécessaire
  if (
    riskLevel === "medium" && 
    (dataTypes.includes("health_data") || 
     dataTypes.includes("advance_directives") ||
     dataTypes.includes("trusted_persons"))
  ) {
    return true;
  }
  
  return false;
};

/**
 * Génère un modèle de notification CNIL
 * @param breach Les détails de la violation
 * @returns Un texte formaté pour la notification CNIL
 */
export const generateCNILNotificationTemplate = (breach: DataBreachNotification): string => {
  return `
NOTIFICATION DE VIOLATION DE DONNÉES PERSONNELLES
Article 33 du Règlement (UE) 2016/679 (RGPD)

1. INFORMATIONS SUR L'ENTITÉ CONCERNÉE
Nom de l'organisation: DirectivesPlus
Délégué à la Protection des Données: [NOM DU DPO]
Contact: dpo@directivesplus.fr
Téléphone: [TÉLÉPHONE DU DPO]

2. DÉTAILS DE LA VIOLATION
Type de violation: ${breach.breach_type}
Date de détection: ${new Date(breach.detection_date).toLocaleDateString('fr-FR')}
Description: ${breach.description}

3. DONNÉES CONCERNÉES
Types de données: ${breach.affected_data_types.join(', ')}
Catégories de personnes concernées: Utilisateurs du service DirectivesPlus
Nombre approximatif de personnes concernées: ${breach.affected_users_count || "À déterminer"}

4. CONSÉQUENCES POSSIBLES
Niveau de risque: ${breach.risk_level}
Conséquences potentielles: [À COMPLÉTER]

5. MESURES PRISES OU PRÉVUES
Mesures de remédiation: ${breach.remediation_measures}
Mesures pour atténuer les risques: [À COMPLÉTER]
Communication aux personnes concernées: ${breach.is_notified_to_users ? "Oui" : "Non"}

6. INFORMATIONS COMPLÉMENTAIRES
Personne effectuant le signalement: ${breach.reporter_name}
Fonction: [À COMPLÉTER]
Date du rapport: ${new Date().toLocaleDateString('fr-FR')}
  `;
};
