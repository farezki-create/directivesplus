
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AlertSettings, SettingsFormData } from './types';

export const useAlertSettingsData = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AlertSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching settings');
      return;
    }

    try {
      console.log('Fetching settings for user:', user.id);
      
      const { data, error } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        throw error;
      }
      
      console.log('Settings fetched successfully:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error fetching alert settings:', error);
    }
  }, [user?.id]);

  const saveSettings = useCallback(async (newSettings: SettingsFormData) => {
    if (!user?.id) {
      console.error('No user ID available for saving settings');
      return false;
    }

    try {
      console.log('Saving settings:', newSettings);
      console.log('User ID for settings:', user.id);
      
      const settingsData = {
        ...newSettings,
        patient_id: user.id
      };

      const { error } = await supabase
        .from('patient_alert_settings')
        .upsert(settingsData);

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Erreur de base de données",
          description: `Erreur lors de l'enregistrement: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres d'alerte ont été enregistrés"
      });

      await fetchSettings();
      return true;
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, fetchSettings]);

  return {
    settings,
    loading,
    fetchSettings,
    saveSettings,
    setLoading
  };
};
