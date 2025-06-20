
import { useProfileAlertData } from './useProfileAlertData';
import { useProfileContactOperations } from './useProfileContactOperations';
import { useProfileSettingsOperations } from './useProfileSettingsOperations';

export const useProfileAlertSettings = () => {
  const {
    alertData,
    setAlertData,
    loading,
    setLoading,
    fetchAlertSettings
  } = useProfileAlertData();

  const { saveContact, deleteContact } = useProfileContactOperations(
    alertData,
    setAlertData,
    fetchAlertSettings
  );

  const { saveSettings } = useProfileSettingsOperations(setAlertData);

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

// Re-export types for backwards compatibility
export type { ProfileAlertSettings } from './types';
