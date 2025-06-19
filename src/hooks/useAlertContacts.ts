
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

export const useAlertContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<AlertContact[]>([]);
  const [settings, setSettings] = useState<AlertSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('patient_alert_contacts')
        .select('*')
        .eq('patient_id', user.id)
        .eq('is_active', true)
        .order('contact_type');

      if (error) throw error;
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
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching alert settings:', error);
    }
  };

  const saveContact = async (contact: Omit<AlertContact, 'id' | 'patient_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return false;

    try {
      // Mapper les types de contact français vers les types de base de données
      const contactTypeMapping: Record<string, string> = {
        'soignant': 'doctor',
        'famille': 'family',
        'personne_confiance': 'family',
        'had': 'doctor',
        'soins_palliatifs': 'doctor',
        'infirmiere': 'doctor',
        'medecin_traitant': 'doctor',
        'autre': 'friend'
      };

      const mappedContactType = contactTypeMapping[contact.contact_type] || 'friend';

      const { error } = await supabase
        .from('patient_alert_contacts')
        .insert({
          ...contact,
          contact_type: mappedContactType,
          patient_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Contact ajouté",
        description: "Le contact d'alerte a été enregistré avec succès"
      });

      await fetchContacts();
      return true;
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le contact",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateContact = async (id: string, updates: Partial<AlertContact>) => {
    try {
      const { error } = await supabase
        .from('patient_alert_contacts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Contact modifié",
        description: "Le contact a été mis à jour avec succès"
      });

      await fetchContacts();
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le contact",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patient_alert_contacts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès"
      });

      await fetchContacts();
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contact",
        variant: "destructive"
      });
      return false;
    }
  };

  const saveSettings = async (newSettings: Omit<AlertSettings, 'id' | 'patient_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('patient_alert_settings')
        .upsert({
          ...newSettings,
          patient_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres d'alerte ont été enregistrés"
      });

      await fetchSettings();
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchContacts(), fetchSettings()]);
      setLoading(false);
    };

    if (user?.id) {
      loadData();
    }
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
