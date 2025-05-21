
/**
 * Utilitaires pour évaluer les besoins de notification suite à une violation de données
 */

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
