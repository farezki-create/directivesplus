
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileAlertSettings } from './alerts/useProfileAlertSettings';

export const useProfileAlertContacts = () => {
  const { user } = useAuth();
  const {
    contacts,
    settings,
    loading,
    fetchAlertSettings,
    saveContact,
    deleteContact,
    saveSettings,
    setLoading
  } = useProfileAlertSettings();

  const refetch = async () => {
    await fetchAlertSettings();
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        console.log('No user ID, skipping data load');
        setLoading(false);
        return;
      }

      console.log('Loading alert data for user:', user.id);
      setLoading(true);
      
      try {
        await fetchAlertSettings();
      } catch (error) {
        console.error('Error loading alert data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, fetchAlertSettings, setLoading]);

  return {
    contacts,
    settings,
    loading,
    saveContact,
    deleteContact,
    saveSettings,
    refetch
  };
};

// Re-export types for backwards compatibility
export type { ProfileAlertSettings } from './alerts/useProfileAlertSettings';
