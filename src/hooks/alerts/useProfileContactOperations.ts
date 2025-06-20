
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ProfileAlertData, ProfileAlertContact } from './types';

export const useProfileContactOperations = (
  alertData: ProfileAlertData,
  setAlertData: React.Dispatch<React.SetStateAction<ProfileAlertData>>,
  fetchAlertSettings: () => Promise<void>
) => {
  const { user } = useAuth();

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
      const newContact: ProfileAlertContact = {
        id: crypto.randomUUID(),
        ...contact
      };

      const updatedContacts = [...alertData.alert_contacts, newContact];

      const { error } = await supabase
        .from('user_profiles')
        .update({
          alert_contacts: updatedContacts as any
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
  }, [user?.id, alertData.alert_contacts, setAlertData]);

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
          alert_contacts: updatedContacts as any
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
  }, [user?.id, alertData.alert_contacts, setAlertData]);

  return {
    saveContact,
    deleteContact
  };
};
