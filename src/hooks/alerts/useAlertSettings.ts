
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
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching alert settings for user:", userId);
      
      const { data, error } = await supabase.functions.invoke('manage-alert-settings', {
        method: 'GET'
      });

      if (error) {
        console.error('Error fetching alert settings:', error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les paramètres: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (data?.settings) {
        console.log("Settings loaded:", data.settings);
        setSettings(data.settings);
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

      const { data, error } = await supabase.functions.invoke('manage-alert-settings', {
        method: 'POST',
        body: { 
          settings
        }
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
        description: data?.message || "Vos paramètres d'alerte ont été enregistrés avec succès.",
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
