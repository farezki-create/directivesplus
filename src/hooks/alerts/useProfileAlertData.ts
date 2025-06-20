
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ProfileAlertData, ProfileAlertContact, ProfileAlertSettings } from './types';

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

  const parseAlertContacts = (contacts: any): ProfileAlertContact[] => {
    if (!contacts || !Array.isArray(contacts)) return [];
    return contacts.filter(contact => 
      contact && 
      typeof contact === 'object' && 
      contact.id && 
      contact.contact_name && 
      contact.contact_type
    ) as ProfileAlertContact[];
  };

  const parseAlertSettings = (settings: any): ProfileAlertSettings => {
    if (!settings || typeof settings !== 'object') {
      return {
        auto_alert_enabled: false,
        alert_threshold: 7,
        symptom_types: ['douleur', 'dyspnee', 'anxiete'],
        sms_enabled: false,
        sms_provider: 'twilio',
        phone_number: '',
        whatsapp_number: ''
      };
    }

    return {
      auto_alert_enabled: Boolean(settings.auto_alert_enabled),
      alert_threshold: Number(settings.alert_threshold) || 7,
      symptom_types: Array.isArray(settings.symptom_types) ? settings.symptom_types : ['douleur', 'dyspnee', 'anxiete'],
      sms_enabled: Boolean(settings.sms_enabled),
      sms_provider: settings.sms_provider === 'whatsapp' ? 'whatsapp' : 'twilio',
      phone_number: String(settings.phone_number || ''),
      whatsapp_number: String(settings.whatsapp_number || '')
    };
  };

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
          alert_contacts: parseAlertContacts(data.alert_contacts),
          alert_settings: parseAlertSettings(data.alert_settings)
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
