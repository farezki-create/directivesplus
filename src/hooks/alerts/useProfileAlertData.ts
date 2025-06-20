
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

  const parseAlertContacts = (contacts: any[]): ProfileAlertContact[] => {
    console.log('Parsing alert contacts:', contacts);
    if (!contacts || !Array.isArray(contacts)) return [];
    
    return contacts.filter(contact => 
      contact && 
      typeof contact === 'object' && 
      contact.id && 
      contact.contact_name && 
      contact.contact_type
    ).map(contact => ({
      id: contact.id,
      contact_type: contact.contact_type,
      contact_name: contact.contact_name,
      phone_number: contact.phone_number || undefined,
      email: contact.email || undefined
    }));
  };

  const parseAlertSettings = (settings: any): ProfileAlertSettings => {
    console.log('Parsing alert settings:', settings);
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
      console.log('Fetching alert settings for user:', user.id);
      
      // Fetch contacts from patient_alert_contacts table
      const { data: contactsData, error: contactsError } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', user.id)
        .eq('is_active', true);

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      }

      // Fetch settings from patient_alert_settings table
      const { data: settingsData, error: settingsError } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
      }
      
      console.log('Contacts fetched:', contactsData);
      console.log('Settings fetched:', settingsData);
      
      const contacts = parseAlertContacts(contactsData || []);
      const settings = parseAlertSettings(settingsData);
      
      const newAlertData = {
        alert_contacts: contacts,
        alert_settings: settings
      };
      
      console.log('Setting alert data:', newAlertData);
      setAlertData(newAlertData);
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
