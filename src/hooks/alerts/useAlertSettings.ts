
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertSettings } from '@/components/alerts/types';

export const useAlertSettings = (userId?: string) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    auto_alert_enabled: false,
    alert_threshold: 7,
    symptom_types: ['douleur', 'dyspnee', 'anxiete'],
    sms_enabled: false,
    sms_provider: 'twilio',
    phone_number: '',
    whatsapp_number: ''
  });

  const fetchSettings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      console.log("Fetching alert settings for user:", userId);
      
      const { data, error } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching alert settings:', error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les paramètres: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log("Settings loaded:", data);
        const validProvider = data.sms_provider === 'whatsapp' ? 'whatsapp' : 'twilio';
        
        setSettings({
          auto_alert_enabled: data.auto_alert_enabled || false,
          alert_threshold: data.alert_threshold || 7,
          symptom_types: data.symptom_types || ['douleur', 'dyspnee', 'anxiete'],
          sms_enabled: data.sms_enabled || false,
          sms_provider: validProvider,
          phone_number: data.phone_number || '',
          whatsapp_number: data.whatsapp_number || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors du chargement des paramètres.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!userId) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour sauvegarder vos paramètres.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      console.log("Saving alert settings for user:", userId);
      console.log("Settings to save:", settings);

      const dataToSave = {
        patient_id: userId,
        auto_alert_enabled: Boolean(settings.auto_alert_enabled),
        alert_threshold: Number(settings.alert_threshold),
        symptom_types: Array.isArray(settings.symptom_types) ? settings.symptom_types : ['douleur', 'dyspnee', 'anxiete'],
        sms_enabled: Boolean(settings.sms_enabled),
        sms_provider: settings.sms_provider === 'whatsapp' ? 'whatsapp' : 'twilio',
        phone_number: settings.phone_number || null,
        whatsapp_number: settings.whatsapp_number || null
      };

      console.log("Data to save:", dataToSave);

      const { error } = await supabase
        .from('patient_alert_settings')
        .upsert(dataToSave, {
          onConflict: 'patient_id'
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: `Erreur: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log("Settings saved successfully");
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres d'alerte ont été enregistrés avec succès.",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: `Une erreur inattendue s'est produite: ${error.message || 'Problème technique'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  return {
    settings,
    setSettings,
    loading,
    saving,
    saveSettings
  };
};
