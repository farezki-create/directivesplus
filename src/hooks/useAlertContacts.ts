
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAlertContactsData } from './alerts/useAlertContactsData';
import { useAlertSettingsData } from './alerts/useAlertSettingsData';

export const useAlertContacts = () => {
  const { user } = useAuth();
  
  const {
    contacts,
    loading: contactsLoading,
    fetchContacts,
    saveContact,
    updateContact,
    deleteContact,
    setLoading: setContactsLoading
  } = useAlertContactsData();

  const {
    settings,
    loading: settingsLoading,
    fetchSettings,
    saveSettings,
    setLoading: setSettingsLoading
  } = useAlertSettingsData();

  const loading = contactsLoading || settingsLoading;

  const refetch = async () => {
    await Promise.all([fetchContacts(), fetchSettings()]);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        console.log('No user ID, skipping data load');
        setContactsLoading(false);
        setSettingsLoading(false);
        return;
      }

      console.log('Loading data for user:', user.id);
      setContactsLoading(true);
      setSettingsLoading(true);
      
      try {
        await Promise.all([fetchContacts(), fetchSettings()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setContactsLoading(false);
        setSettingsLoading(false);
      }
    };

    loadData();
  }, [user?.id, fetchContacts, fetchSettings, setContactsLoading, setSettingsLoading]);

  return {
    contacts,
    settings,
    loading,
    saveContact,
    updateContact,
    deleteContact,
    saveSettings,
    refetch
  };
};

// Re-export types for backwards compatibility
export type { AlertContact, AlertSettings } from './alerts/types';
