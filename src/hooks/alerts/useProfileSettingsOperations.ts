
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ProfileAlertData, ProfileAlertSettings } from './types';

export const useProfileSettingsOperations = (
  setAlertData: React.Dispatch<React.SetStateAction<ProfileAlertData>>
) => {
  const { user } = useAuth();

  const saveSettings = useCallback(async (newSettings: ProfileAlertSettings) => {
    if (!user?.id) {
      console.error('No user ID available for saving settings');
      return false;
    }

    try {
      console.log('Saving alert settings to profile:', newSettings);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          alert_settings: newSettings as any
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Erreur de base de données",
          description: `Erreur lors de l'enregistrement: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      setAlertData(prev => ({
        ...prev,
        alert_settings: newSettings
      }));

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres d'alerte ont été enregistrés"
      });

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
  }, [user?.id, setAlertData]);

  return {
    saveSettings
  };
};
