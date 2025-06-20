
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AlertContact } from "./types";

export const useAlertContacts = (userId: string | undefined) => {
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAlertContacts = async () => {
    try {
      console.log("Fetching alert contacts...");
      setLoading(true);
      
      // Récupérer l'utilisateur authentifié
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log("User not authenticated:", authError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("patient_alert_contacts")
        .select("*")
        .eq("patient_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching alert contacts:", error);
        throw error;
      }

      setAlertContacts(data || []);
      console.log("Alert contacts loaded:", data);
    } catch (error: any) {
      console.error("Error fetching alert contacts:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos contacts d'alerte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    const newContact: Omit<AlertContact, "id"> = {
      contact_type: "",
      contact_name: "",
      phone_number: "",
      email: "",
    };
    
    setAlertContacts([...alertContacts, { ...newContact, id: `temp-${Date.now()}` }]);
  };

  const handleChange = (index: number, field: keyof AlertContact, value: string) => {
    const updatedContacts = [...alertContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
    };
    setAlertContacts(updatedContacts);
  };

  const handleRemove = (index: number) => {
    const updatedContacts = [...alertContacts];
    updatedContacts.splice(index, 1);
    setAlertContacts(updatedContacts);
  };

  const handleSave = async () => {
    try {
      console.log("Saving alert contacts...");
      setSaving(true);

      // Récupérer l'utilisateur authentifié
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter.",
          variant: "destructive",
        });
        return;
      }

      // Filtrer les contacts valides
      const validContacts = alertContacts.filter(contact => 
        contact.contact_name.trim() !== "" && 
        contact.contact_type.trim() !== "" &&
        (contact.phone_number?.trim() || contact.email?.trim())
      );
      
      if (validContacts.length === 0) {
        toast({
          title: "Aucun contact valide",
          description: "Veuillez ajouter au moins un contact avec un nom, un type et un moyen de contact.",
          variant: "destructive",
        });
        return;
      }

      // Désactiver tous les contacts existants pour cet utilisateur
      const { error: deactivateError } = await supabase
        .from("patient_alert_contacts")
        .update({ is_active: false })
        .eq("patient_id", user.id);

      if (deactivateError) {
        console.error("Error deactivating old contacts:", deactivateError);
        throw deactivateError;
      }

      // Insérer les nouveaux contacts
      const contactsToInsert = validContacts.map(contact => ({
        contact_type: contact.contact_type,
        contact_name: contact.contact_name,
        phone_number: contact.phone_number || null,
        email: contact.email || null,
        patient_id: user.id,
        is_active: true
      }));

      const { error: insertError } = await supabase
        .from("patient_alert_contacts")
        .insert(contactsToInsert);

      if (insertError) {
        console.error("Error inserting new contacts:", insertError);
        throw insertError;
      }

      toast({
        title: "Sauvegarde réussie",
        description: "Vos contacts d'alerte ont été enregistrés avec succès.",
      });

      // Recharger la liste
      await fetchAlertContacts();
    } catch (error: any) {
      console.error("Error saving alert contacts:", error);
      
      toast({
        title: "Erreur de sauvegarde",
        description: `Erreur: ${error.message || 'Problème technique'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Charger les contacts au démarrage
  useEffect(() => {
    fetchAlertContacts();
  }, []);

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
