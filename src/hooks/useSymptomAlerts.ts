
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AlertData {
  patient_id: string;
  type_alerte: string;
  details: string;
  notifie_a: string[];
}

export const useSymptomAlerts = () => {
  const { user } = useAuth();
  const [alerting, setAlerting] = useState(false);

  const checkAndCreateAlert = async (douleur: number, dyspnee: number, anxiete: number) => {
    if (!user?.id) return;

    // Vérifier si des seuils critiques sont atteints
    const criticalSymptoms = [];
    if (douleur >= 8) criticalSymptoms.push(`Douleur critique (${douleur}/10)`);
    if (dyspnee >= 7) criticalSymptoms.push(`Dyspnée sévère (${dyspnee}/10)`);
    if (anxiete >= 8) criticalSymptoms.push(`Anxiété critique (${anxiete}/10)`);

    if (criticalSymptoms.length === 0) return;

    setAlerting(true);

    try {
      const alertData: AlertData = {
        patient_id: user.id,
        type_alerte: 'symptôme critique',
        details: `Symptômes critiques détectés: ${criticalSymptoms.join(', ')}`,
        notifie_a: ['soignant@directivesplus.fr'] // Email par défaut des soignants
      };

      const { error } = await supabase
        .from("alertes")
        .insert(alertData);

      if (error) {
        console.error("Erreur lors de la création de l'alerte:", error);
        return false;
      }

      
      return true;
    } catch (err) {
      console.error("Erreur:", err);
      return false;
    } finally {
      setAlerting(false);
    }
  };

  return {
    checkAndCreateAlert,
    alerting
  };
};
