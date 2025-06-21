
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
    console.log("🔍 Vérification des alertes pour:", { douleur, dyspnee, anxiete, fatigue, sommeil });

    try {
      // Récupérer les paramètres d'alerte du patient
      const { data: settings, error: settingsError } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération des paramètres:', settingsError);
      }

      // Paramètres par défaut si pas de configuration personnalisée
      const effectiveSettings = settings || {
        auto_alert_enabled: true,
        alert_threshold: 7,
        symptom_types: ['douleur', 'dyspnee', 'anxiete', 'fatigue', 'sommeil'],
        sms_enabled: false,
        sms_provider: 'twilio',
        phone_number: '',
        whatsapp_number: ''
      };

      console.log("⚙️ Paramètres d'alerte:", effectiveSettings);
      
      // Vérifier quels symptômes dépassent le seuil
      const threshold = effectiveSettings.alert_threshold || 7;
      const criticalSymptoms: string[] = [];
      
      if (douleur >= threshold && effectiveSettings.symptom_types.includes('douleur')) {
        criticalSymptoms.push(`Douleur (${douleur}/10)`);
      }
      if (dyspnee >= threshold && effectiveSettings.symptom_types.includes('dyspnee')) {
        criticalSymptoms.push(`Dyspnée (${dyspnee}/10)`);
      }
      if (anxiete >= threshold && effectiveSettings.symptom_types.includes('anxiete')) {
        criticalSymptoms.push(`Anxiété (${anxiete}/10)`);
      }
      if (fatigue && fatigue >= threshold && effectiveSettings.symptom_types.includes('fatigue')) {
        criticalSymptoms.push(`Fatigue (${fatigue}/10)`);
      }
      if (sommeil && sommeil >= threshold && effectiveSettings.symptom_types.includes('sommeil')) {
        criticalSymptoms.push(`Sommeil (${sommeil}/10)`);
      }

      console.log("🚨 Symptômes critiques détectés:", criticalSymptoms);

      // Si aucun symptôme critique
      if (criticalSymptoms.length === 0) {
        console.log("✅ Aucun symptôme critique, pas d'alerte nécessaire");
        return { shouldAlert: false, criticalSymptoms: [], redirectToAlerts: false };
      }

      // Récupérer les contacts d'alerte
      const { data: contacts, error: contactsError } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', user.id)
        .eq('is_active', true);

      if (contactsError) {
        console.error('Erreur lors de la récupération des contacts:', contactsError);
      }

      console.log("👥 Contacts d'alerte trouvés:", contacts?.length || 0);

      // Si les alertes auto sont activées ET le patient a des contacts
      if (effectiveSettings.auto_alert_enabled && contacts && contacts.length > 0) {
        console.log("📧 Envoi d'alertes automatiques...");
        
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
          console.log("✅ Alerte créée en base de données");
        }

        // Envoyer les notifications via l'Edge Function
        try {
          console.log("📱 Envoi des notifications SMS/Email...");
          
          // Préparer les données pour l'Edge Function
          const alertData = {
            patient_id: user.id,
            critical_symptoms: criticalSymptoms,
            contacts: contacts,
            settings: effectiveSettings
          };

          const { data: alertResponse, error: alertFunctionError } = await supabase.functions.invoke('send-symptom-alert', {
            body: alertData
          });

          if (alertFunctionError) {
            console.error('Erreur Edge Function:', alertFunctionError);
          } else {
            console.log("✅ Notifications envoyées:", alertResponse);
          }
        } catch (functionError) {
          console.error('Erreur lors de l\'appel à l\'Edge Function:', functionError);
        }

        toast({
          title: "🚨 Alerte envoyée",
          description: "Vos contacts ont été notifiés de votre état critique",
          variant: "destructive"
        });

        return { shouldAlert: true, criticalSymptoms, redirectToAlerts: false };
      } else {
        // Si pas de contacts ou alertes auto désactivées, proposer la redirection
        console.log("⚠️ Pas de contacts ou alertes désactivées");
        
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
