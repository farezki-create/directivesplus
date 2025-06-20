
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AlertContact, ContactFormData } from './types';
import { mapContactType } from './utils';

export const useAlertContactsData = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<AlertContact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching contacts');
      return;
    }

    try {
      console.log('Fetching contacts for user:', user.id);
      
      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', user.id)
        .eq('is_active', true)
        .order('contact_type');

      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
      
      console.log('Contacts fetched successfully:', data);
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching alert contacts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts d'alerte",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  const saveContact = useCallback(async (contact: ContactFormData) => {
    console.log('=== DEBUT SAUVEGARDE CONTACT ===');
    console.log('User from auth context:', user);
    console.log('Contact data to save:', contact);

    // Vérification stricte de l'utilisateur connecté
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
      // Vérifier que l'utilisateur est bien authentifié dans Supabase
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !supabaseUser) {
        console.error('Supabase user verification failed:', userError);
        toast({
          title: "Erreur d'authentification",
          description: "Session expirée. Veuillez vous reconnecter.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Supabase user verified:', supabaseUser.id);
      console.log('Context user ID:', user.id);
      
      // S'assurer que les IDs correspondent
      if (supabaseUser.id !== user.id) {
        console.error('User ID mismatch between context and Supabase');
        toast({
          title: "Erreur de synchronisation",
          description: "Problème de session. Veuillez vous reconnecter.",
          variant: "destructive"
        });
        return false;
      }

      const mappedContactType = mapContactType(contact.contact_type);
      
      const contactData = {
        contact_type: mappedContactType,
        contact_name: contact.contact_name.trim(),
        phone_number: contact.phone_number?.trim() || null,
        email: contact.email?.trim() || null,
        is_active: true,
        patient_id: user.id // Utiliser l'ID de l'utilisateur connecté
      };
      
      console.log('Final contact data for insert:', contactData);

      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        console.error('Database error when saving contact:', error);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Error message:', error.message);
        
        // Gestion spécifique des erreurs
        if (error.code === '42501' || error.message.includes('permission denied')) {
          toast({
            title: "Erreur de permission",
            description: "Problème d'autorisation. Vérifiez votre connexion.",
            variant: "destructive"
          });
        } else if (error.code === '23514') {
          toast({
            title: "Erreur de validation",
            description: "Données invalides. Vérifiez vos informations.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur de base de données",
            description: `Erreur lors de l'enregistrement: ${error.message}`,
            variant: "destructive"
          });
        }
        return false;
      }

      console.log('Contact saved successfully:', data);

      toast({
        title: "Contact ajouté",
        description: "Le contact d'alerte a été enregistré avec succès"
      });

      // Recharger la liste des contacts
      await fetchContacts();
      return true;
    } catch (error: any) {
      console.error('Unexpected error saving contact:', error);
      toast({
        title: "Erreur inattendue",
        description: error.message || "Impossible d'enregistrer le contact",
        variant: "destructive"
      });
      return false;
    } finally {
      console.log('=== FIN SAUVEGARDE CONTACT ===');
    }
  }, [user?.id, fetchContacts]);

  const updateContact = useCallback(async (id: string, updates: Partial<AlertContact>) => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier un contact",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Updating contact:', id, updates);
      
      const { error } = await supabase
        .from('patient_alert_contacts')
        .update(updates)
        .eq('id', id)
        .eq('patient_id', user.id); // S'assurer que c'est bien le contact de l'utilisateur

      if (error) {
        console.error('Error updating contact:', error);
        throw error;
      }

      toast({
        title: "Contact modifié",
        description: "Le contact a été mis à jour avec succès"
      });

      await fetchContacts();
      return true;
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le contact",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, fetchContacts]);

  const deleteContact = useCallback(async (id: string) => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer un contact",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Deleting contact:', id);
      
      const { error } = await supabase
        .from('patient_alert_contacts')
        .update({ is_active: false })
        .eq('id', id)
        .eq('patient_id', user.id); // S'assurer que c'est bien le contact de l'utilisateur

      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }

      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès"
      });

      await fetchContacts();
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
  }, [user?.id, fetchContacts]);

  return {
    contacts,
    loading,
    fetchContacts,
    saveContact,
    updateContact,
    deleteContact,
    setLoading
  };
};
