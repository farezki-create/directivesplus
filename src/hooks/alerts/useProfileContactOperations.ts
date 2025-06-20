
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ProfileAlertData } from './types';

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
    console.log('=== DEBUT SAUVEGARDE CONTACT ===');
    console.log('User from auth context:', user);
    console.log('Contact data to save:', contact);

    if (!user?.id) {
      console.error('No user ID available for saving contact');
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour ajouter un contact",
        variant: "destructive"
      });
      return false;
    }

    // Validation des données d'entrée
    if (!contact.contact_name?.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du contact est requis",
        variant: "destructive"
      });
      return false;
    }

    if (!contact.contact_type) {
      toast({
        title: "Erreur de validation",
        description: "Le type de contact est requis",
        variant: "destructive"
      });
      return false;
    }

    if (!contact.phone_number?.trim() && !contact.email?.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Au moins un numéro de téléphone ou un email est requis",
        variant: "destructive"
      });
      return false;
    }

    try {
      const contactData = {
        patient_id: user.id,
        contact_type: contact.contact_type,
        contact_name: contact.contact_name.trim(),
        phone_number: contact.phone_number?.trim() || null,
        email: contact.email?.trim() || null,
        is_active: true
      };
      
      console.log('Final contact data for insert:', contactData);

      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        console.error('Database error when saving contact:', error);
        toast({
          title: "Erreur lors de l'enregistrement",
          description: "Impossible d'ajouter le contact. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Contact saved successfully:', data);

      toast({
        title: "Contact ajouté",
        description: "Le contact d'alerte a été enregistré avec succès"
      });

      // Recharger les données
      await fetchAlertSettings();
      return true;
    } catch (error: any) {
      console.error('Unexpected error saving contact:', error);
      toast({
        title: "Erreur inattendue",
        description: "Impossible d'enregistrer le contact",
        variant: "destructive"
      });
      return false;
    } finally {
      console.log('=== FIN SAUVEGARDE CONTACT ===');
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

      await fetchAlertSettings();
      return true;
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contact",
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
