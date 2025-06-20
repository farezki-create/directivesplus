
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
      console.log('Saving contact:', contact);

      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .insert({
          patient_id: user.id,
          contact_type: contact.contact_type,
          contact_name: contact.contact_name,
          phone_number: contact.phone_number || null,
          email: contact.email || null,
          is_active: true
        })
        .select();

      if (error) {
        console.error('Error saving contact:', error);
        throw error;
      }

      console.log('Contact saved successfully:', data);

      toast({
        title: "Contact ajouté",
        description: "Le contact d'alerte a été enregistré avec succès"
      });

      // Recharger immédiatement les données pour s'assurer de la cohérence
      console.log('Reloading alert settings after contact save...');
      await fetchAlertSettings();

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
  }, [user?.id, fetchAlertSettings]);

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
      console.log('Deleting contact with ID:', contactId);

      const { error } = await supabase
        .from('patient_alert_contacts')
        .update({ is_active: false })
        .eq('id', contactId)
        .eq('patient_id', user.id);

      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }

      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès"
      });

      // Recharger les données après suppression
      console.log('Reloading alert settings after contact deletion...');
      await fetchAlertSettings();

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
  }, [user?.id, fetchAlertSettings]);

  return {
    saveContact,
    deleteContact
  };
};
