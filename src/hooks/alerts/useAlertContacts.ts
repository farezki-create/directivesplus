
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertContact } from './types';

export const useAlertContacts = (userId?: string) => {
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAlertContacts = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', userId);

      if (error) {
        console.error('Error fetching alert contacts:', error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les contacts: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setAlertContacts(data || []);
    } catch (error) {
      console.error('Error fetching alert contacts:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors du chargement des contacts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    const newContact: AlertContact = {
      patient_id: userId || '',
      contact_type: '',
      contact_name: '',
      phone_number: '',
      email: '',
      is_active: true
    };
    setAlertContacts(prev => [...prev, newContact]);
  };

  const handleChange = (index: number, field: keyof AlertContact, value: string) => {
    setAlertContacts(prev => 
      prev.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleRemove = (index: number) => {
    setAlertContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour sauvegarder vos contacts.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const validContacts = alertContacts.filter(contact =>
        contact.contact_type && 
        contact.contact_name && 
        (contact.phone_number || contact.email)
      );

      if (validContacts.length === 0) {
        toast({
          title: "Validation échouée",
          description: "Veuillez remplir au moins un contact avec toutes les informations requises.",
          variant: "destructive",
        });
        return;
      }

      // Supprimer tous les anciens contacts
      const { error: deleteError } = await supabase
        .from('patient_alert_contacts')
        .delete()
        .eq('patient_id', userId);

      if (deleteError) {
        console.error('Error deleting old contacts:', deleteError);
        toast({
          title: "Erreur de suppression",
          description: `Erreur lors de la suppression des anciens contacts: ${deleteError.message}`,
          variant: "destructive",
        });
        return;
      }

      // Insérer les nouveaux contacts valides
      const contactsToInsert = validContacts.map(contact => ({
        patient_id: userId,
        contact_type: contact.contact_type,
        contact_name: contact.contact_name,
        phone_number: contact.phone_number || null,
        email: contact.email || null,
        is_active: true
      }));

      const { error: insertError } = await supabase
        .from('patient_alert_contacts')
        .insert(contactsToInsert);

      if (insertError) {
        console.error('Error inserting contacts:', insertError);
        toast({
          title: "Erreur de sauvegarde",
          description: `Erreur lors de la sauvegarde: ${insertError.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Contacts sauvegardés",
        description: "Vos contacts d'alerte ont été enregistrés avec succès.",
      });

      await fetchAlertContacts();

    } catch (error: any) {
      console.error('Error saving alert contacts:', error);
      toast({
        title: "Erreur",
        description: `Une erreur inattendue s'est produite: ${error.message || 'Problème technique'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAlertContacts();
  }, [userId]);

  return {
    alertContacts,
    loading,
    saving,
    handleAddContact,
    handleChange,
    handleRemove,
    handleSave
  };
};
