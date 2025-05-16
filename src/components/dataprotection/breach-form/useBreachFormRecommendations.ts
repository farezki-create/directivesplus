
import { useState, useEffect } from 'react';
import { evaluateAuthorityNotificationNeeded, evaluateUserNotificationNeeded } from "@/utils/dataBreachUtils";

interface RecommendationsData {
  notifyAuthorities: boolean;
  notifyUsers: boolean;
  urgency: "normal" | "urgent" | "critical";
}

export const useBreachFormRecommendations = (
  riskLevel: "low" | "medium" | "high" | "critical",
  dataTypes: string[],
  isEncrypted: boolean
) => {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);

  const updateRecommendations = () => {
    if (dataTypes.length > 0 && riskLevel) {
      const notifyAuthorities = evaluateAuthorityNotificationNeeded(
        riskLevel,
        dataTypes
      );
      
      const notifyUsers = evaluateUserNotificationNeeded(
        riskLevel,
        dataTypes,
        isEncrypted
      );
      
      let urgency: "normal" | "urgent" | "critical" = "normal";
      if (riskLevel === "high") urgency = "urgent";
      if (riskLevel === "critical") urgency = "critical";
      
      setRecommendations({
        notifyAuthorities,
        notifyUsers,
        urgency
      });
    }
  };

  // Update recommendations when dependencies change
  useEffect(() => {
    updateRecommendations();
  }, [riskLevel, dataTypes, isEncrypted]);

  return {
    recommendations,
    updateRecommendations
  };
};
