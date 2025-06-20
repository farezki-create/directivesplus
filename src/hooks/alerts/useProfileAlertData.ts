
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ProfileAlertData } from './types';

export const useProfileAlertData = () => {
  const { user } = useAuth();
  const [alertData, setAlertData] = useState<ProfileAlertData>({
    alert_contacts: [],
    alert_settings: {
      auto_alert_enabled: false,
      alert_threshold: 7,
      symptom_types: ['douleur', 'dyspnee', 'anxiete'],
      sms_enabled: false,
      sms_provider: 'twilio',
      phone_number: '',
      whatsapp_number: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchAlertSettings = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching alert settings');
      return;
    }

    try {
      console.log('Fetching alert settings from profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('alert_contacts, alert_settings')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching alert settings:', error);
        throw error;
      }
      
      console.log('Alert settings fetched successfully:', data);
      
      if (data) {
        setAlertData({
          alert_contacts: data.alert_contacts || [],
          alert_settings: data.alert_settings || {
            auto_alert_enabled: false,
            alert_threshold: 7,
            symptom_types: ['douleur', 'dyspnee', 'anxiete'],
            sms_enabled: false,
            sms_provider: 'twilio',
            phone_number: '',
            whatsapp_number: ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching alert settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres d'alerte",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  return {
    alertData,
    setAlertData,
    loading,
    setLoading,
    fetchAlertSettings
  };
};
