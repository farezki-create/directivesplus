
/**
 * Types et interfaces pour le système de signalement de violations de données
 */

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
export interface BreachLogData {
  user_id?: string;
  breach_type: string;
  description: string;
  affected_data: string;
  details: any;
  risk_level: string;
}

/**
 * Interface pour les recommendations de notification
 */
export interface BreachRecommendations {
  notifyAuthorities: boolean;
  notifyUsers: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}
