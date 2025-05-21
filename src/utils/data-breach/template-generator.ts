
import { DataBreachNotification } from "./types";

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
