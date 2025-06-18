
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AlertResult {
  shouldAlert: boolean;
  criticalSymptoms: string[];
  redirectToAlerts: boolean;
}

export const useSymptomAlerting = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerting, setAlerting] = useState(false);

  const checkAndTriggerAlert = async (
    douleur: number, 
    dyspnee: number, 
    anxiete: number,
    fatigue?: number,
    sommeil?: number
  ): Promise<AlertResult> => {
    if (!user?.id) return { shouldAlert: false, criticalSymptoms: [], redirectToAlerts: false };

    setAlerting(true);

    try {
      // Récupérer les paramètres d'alerte du patient
      const { data: settings } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      // Vérifier quels symptômes dépassent le seuil (par défaut 7)
      const threshold = settings?.alert_threshold || 7;
      const criticalSymptoms: string[] = [];
      
      if (douleur >= threshold) criticalSymptoms.push(`Douleur (${douleur}/10)`);
      if (dyspnee >= threshold) criticalSymptoms.push(`Dyspnée (${dyspnee}/10)`);
      if (anxiete >= threshold) criticalSymptoms.push(`Anxiété (${anxiete}/10)`);
      if (fatigue && fatigue >= threshold) criticalSymptoms.push(`Fatigue (${fatigue}/10)`);
      if (sommeil && sommeil >= threshold) criticalSymptoms.push(`Sommeil (${sommeil}/10)`);

      // Si aucun symptôme critique
      if (criticalSymptoms.length === 0) {
        return { shouldAlert: false, criticalSymptoms: [], redirectToAlerts: false };
      }

      // Récupérer les contacts d'alerte
      const { data: contacts } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', user.id)
        .eq('is_active', true);

      // Si le patient a des contacts ET les alertes auto sont activées
      if (settings?.auto_alert_enabled && contacts && contacts.length > 0) {
        // Créer une alerte dans la table alertes
        const { error: alertError } = await supabase
          .from('alertes')
          .insert({
            patient_id: user.id,
            type_alerte: 'symptôme critique',
            details: `Symptômes critiques détectés: ${criticalSymptoms.join(', ')}`,
            notifie_a: contacts.map(c => c.email || c.phone_number).filter(Boolean)
          });

        if (alertError) {
          console.error('Erreur lors de la création de l\'alerte:', alertError);
        } else {
          toast({
            title: "🚨 Alerte envoyée",
            description: "Vos contacts ont été notifiés de votre état critique",
            variant: "destructive"
          });
        }

        return { shouldAlert: true, criticalSymptoms, redirectToAlerts: false };
      } else {
        // Si pas de contacts ou alertes auto désactivées, proposer la redirection
        toast({
          title: "⚠️ Symptômes critiques détectés",
          description: "Configurez vos contacts d'alerte pour notifier automatiquement vos proches",
          variant: "destructive"
        });

        return { shouldAlert: true, criticalSymptoms, redirectToAlerts: true };
      }

    } catch (error) {
      console.error('Erreur lors de la vérification des alertes:', error);
      return { shouldAlert: false, criticalSymptoms: [], redirectToAlerts: false };
    } finally {
      setAlerting(false);
    }
  };

  const showAlertDialog = (criticalSymptoms: string[]) => {
    const proceed = window.confirm(
      `🚨 SYMPTÔMES CRITIQUES DÉTECTÉS 🚨\n\n` +
      `${criticalSymptoms.join('\n')}\n\n` +
      `Voulez-vous configurer vos contacts d'alerte pour notifier automatiquement vos proches ?`
    );

    if (proceed) {
      navigate('/alert-management');
    }
  };

  return {
    checkAndTriggerAlert,
    showAlertDialog,
    alerting
  };
};
