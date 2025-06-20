
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProfileAlertSettings {
  alert_contacts: Array<{
    id: string;
    contact_type: string;
    contact_name: string;
    phone_number?: string;
    email?: string;
  }>;
  alert_settings: {
    auto_alert_enabled: boolean;
    alert_threshold: number;
    symptom_types: string[];
    sms_enabled: boolean;
    sms_provider: 'twilio' | 'whatsapp';
    phone_number?: string;
    whatsapp_number?: string;
  };
}

export const useProfileAlertSettings = () => {
  const { user } = useAuth();
  const [alertData, setAlertData] = useState<ProfileAlertSettings>({
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

  const saveContact = useCallback(async (contact: {
    contact_type: string;
    contact_name: string;
    phone_number?: string;
    email?: string;
  }) => {
    if (!user?.id) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour ajouter un contact",
        variant: "destructive"
      });
      return false;
    }

    try {
      const newContact = {
        id: crypto.randomUUID(),
        ...contact
      };

      const updatedContacts = [...alertData.alert_contacts, newContact];

      const { error } = await supabase
        .from('user_profiles')
        .update({
          alert_contacts: updatedContacts
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving contact:', error);
        throw error;
      }

      setAlertData(prev => ({
        ...prev,
        alert_contacts: updatedContacts
      }));

      toast({
        title: "Contact ajouté",
        description: "Le contact d'alerte a été enregistré avec succès"
      });

      return true;
    } catch (error: any) {
      console.error('Error saving contact:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer le contact",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, alertData.alert_contacts]);

  const deleteContact = useCallback(async (contactId: string) => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer un contact",
        variant: "destructive"
      });
      return false;
    }

    try {
      const updatedContacts = alertData.alert_contacts.filter(c => c.id !== contactId);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          alert_contacts: updatedContacts
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }

      setAlertData(prev => ({
        ...prev,
        alert_contacts: updatedContacts
      }));

      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès"
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le contact",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, alertData.alert_contacts]);

  const saveSettings = useCallback(async (newSettings: {
    auto_alert_enabled: boolean;
    alert_threshold: number;
    symptom_types: string[];
    sms_enabled: boolean;
    sms_provider: 'twilio' | 'whatsapp';
    phone_number?: string;
    whatsapp_number?: string;
  }) => {
    if (!user?.id) {
      console.error('No user ID available for saving settings');
      return false;
    }

    try {
      console.log('Saving alert settings to profile:', newSettings);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          alert_settings: newSettings
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
  }, [user?.id]);

  return {
    contacts: alertData.alert_contacts,
    settings: alertData.alert_settings,
    loading,
    fetchAlertSettings,
    saveContact,
    deleteContact,
    saveSettings,
    setLoading
  };
};
