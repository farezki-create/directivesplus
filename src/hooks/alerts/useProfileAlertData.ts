
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
      console.log('=== DEBUT FETCH ALERT SETTINGS ===');
      console.log('Fetching alert settings for user:', user.id);
      setLoading(true);
      
      // Test de connectivité avec Supabase
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('patient_alert_contacts')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
      } else {
        console.log('Supabase connection OK');
      }
      
      // Fetch contacts from patient_alert_contacts table
      console.log('Fetching contacts...');
      const { data: contactsData, error: contactsError } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        console.error('Contacts error details:', {
          message: contactsError.message,
          details: contactsError.details,
          hint: contactsError.hint,
          code: contactsError.code
        });
      } else {
        console.log('Contacts fetched successfully:', contactsData);
      }

      // Fetch settings from patient_alert_settings table
      console.log('Fetching settings...');
      const { data: settingsData, error: settingsError } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
        console.error('Settings error details:', {
          message: settingsError.message,
          details: settingsError.details,
          hint: settingsError.hint,
          code: settingsError.code
        });
      } else {
        console.log('Settings fetched successfully:', settingsData);
      }
      
      console.log('Raw contacts data from DB:', contactsData);
      console.log('Raw settings data from DB:', settingsData);
      
      const contacts = parseAlertContacts(contactsData || []);
      const settings = parseAlertSettings(settingsData);
      
      const newAlertData = {
        alert_contacts: contacts,
        alert_settings: settings
      };
      
      console.log('Final parsed alert data:', newAlertData);
      setAlertData(newAlertData);
      
    } catch (error) {
      console.error('Unexpected error fetching alert settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres d'alerte",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('=== FIN FETCH ALERT SETTINGS ===');
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
