
import { useEffect, useState } from 'react';
import { evaluateAuthorityNotificationNeeded, evaluateUserNotificationNeeded } from '@/utils/data-breach';

type RiskLevel = "low" | "medium" | "high" | "critical";
type UrgencyLevel = "low" | "medium" | "high" | "critical";

/**
 * Hook personnalisé pour générer des recommandations basées sur les données du formulaire de violation
 * @param riskLevel Le niveau de risque sélectionné
 * @param dataTypes Les types de données affectées
 * @param isEncrypted Indique si les données étaient chiffrées
 * @returns Recommandations pour la notification
 */
export const useBreachFormRecommendations = (
  riskLevel: RiskLevel,
  dataTypes: string[],
  isEncrypted: boolean
) => {
  const [recommendations, setRecommendations] = useState<{
    notifyAuthorities: boolean;
    notifyUsers: boolean;
    urgency: UrgencyLevel;
  } | null>(null);

  // Met à jour les recommandations lorsque les paramètres changent
  const updateRecommendations = () => {
    if (!riskLevel || !dataTypes || dataTypes.length === 0) {
      setRecommendations(null);
      return;
    }

    // Détermine si une notification aux autorités est nécessaire
    const notifyAuthorities = evaluateAuthorityNotificationNeeded(riskLevel, dataTypes);
    
    // Détermine si une notification aux personnes concernées est nécessaire
    const notifyUsers = evaluateUserNotificationNeeded(riskLevel, dataTypes, isEncrypted);

    // Utilise directement le niveau de risque comme niveau d'urgence
    const urgency = riskLevel;

    setRecommendations({
      notifyAuthorities,
      notifyUsers,
      urgency
    });
  };

  useEffect(() => {
    updateRecommendations();
  }, [riskLevel, dataTypes, isEncrypted]);

  return { recommendations, updateRecommendations };
};
