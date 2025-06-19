
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface AlertContact {
  id: string;
  patient_id: string;
  contact_type: string;
  contact_name: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlertSettings {
  id: string;
  patient_id: string;
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  created_at: string;
  updated_at: string;
}

// Mapping des types de contact français vers les types de base de données
const CONTACT_TYPE_MAPPING: Record<string, string> = {
  'soignant': 'doctor',
  'famille': 'family',
  'personne_confiance': 'family',
  'had': 'doctor',
  'soins_palliatifs': 'doctor',
  'infirmiere': 'doctor',
  'medecin_traitant': 'doctor',
  'autre': 'friend'
};

export const useAlertContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<AlertContact[]>([]);
  const [settings, setSettings] = useState<AlertSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
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
  };

  const fetchSettings = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching settings');
      return;
    }

    try {
      console.log('Fetching settings for user:', user.id);
      
      const { data, error } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        throw error;
      }
      
      console.log('Settings fetched successfully:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error fetching alert settings:', error);
    }
  };

  const saveContact = async (contact: Omit<AlertContact, 'id' | 'patient_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      console.error('No user ID available for saving contact');
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un contact",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Saving contact:', contact);
      
      // Mapper le type de contact
      const mappedContactType = CONTACT_TYPE_MAPPING[contact.contact_type] || contact.contact_type;
      
      const contactData = {
        contact_type: mappedContactType,
        contact_name: contact.contact_name,
        phone_number: contact.phone_number || null,
        email: contact.email || null,
        is_active: true,
        patient_id: user.id
      };
      
      console.log('Contact data to insert:', contactData);

      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        console.error('Database error when saving contact:', error);
        throw error;
      }

      console.log('Contact saved successfully:', data);

      toast({
        title: "Contact ajouté",
        description: "Le contact d'alerte a été enregistré avec succès"
      });

      await fetchContacts();
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
  };

  const updateContact = async (id: string, updates: Partial<AlertContact>) => {
    try {
      console.log('Updating contact:', id, updates);
      
      const { error } = await supabase
        .from('patient_alert_contacts')
        .update(updates)
        .eq('id', id);

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
  };

  const deleteContact = async (id: string) => {
    try {
      console.log('Deleting contact:', id);
      
      const { error } = await supabase
        .from('patient_alert_contacts')
        .update({ is_active: false })
        .eq('id', id);

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
  };

  const saveSettings = async (newSettings: Omit<AlertSettings, 'id' | 'patient_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      console.error('No user ID available for saving settings');
      return false;
    }

    try {
      console.log('Saving settings:', newSettings);
      
      const settingsData = {
        ...newSettings,
        patient_id: user.id
      };

      const { error } = await supabase
        .from('patient_alert_settings')
        .upsert(settingsData);

      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres d'alerte ont été enregistrés"
      });

      await fetchSettings();
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
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        console.log('No user ID, skipping data load');
        setLoading(false);
        return;
      }

      console.log('Loading data for user:', user.id);
      setLoading(true);
      
      try {
        await Promise.all([fetchContacts(), fetchSettings()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  return {
    contacts,
    settings,
    loading,
    saveContact,
    updateContact,
    deleteContact,
    saveSettings,
    refetch: () => Promise.all([fetchContacts(), fetchSettings()])
  };
};
