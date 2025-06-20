
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AlertContact } from "./types";

export const useAlertContacts = (userId: string | undefined) => {
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAlertContacts = async () => {
    if (!userId) {
      console.log("No user ID provided, cannot fetch alert contacts");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching alert contacts for user:", userId);
      setLoading(true);
      const { data, error } = await supabase
        .from("patient_alert_contacts")
        .select("*")
        .eq("patient_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAlertContacts(data || []);
      console.log("Alert contacts loaded:", data);
    } catch (error: any) {
      console.error("Error fetching alert contacts:", error.message);
      toast({
        title: "Erreur",
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
    
    // Add temporary ID for UI purposes
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
    if (!userId) {
      console.log("No user ID provided, cannot save alert contacts");
      return;
    }

    try {
      console.log("Saving alert contacts for user:", userId);
      setSaving(true);

      // Filter out invalid entries (must have at least a name and contact method)
      const validContacts = alertContacts.filter(contact => 
        contact.contact_name.trim() !== "" && 
        contact.contact_type.trim() !== "" &&
        (contact.phone_number?.trim() || contact.email?.trim())
      );
      
      if (validContacts.length === 0) {
        // If no valid contacts, just refresh the list from database
        await fetchAlertContacts();
        return;
      }

      // First delete all existing contacts for this user
      const { error: deleteError } = await supabase
        .from("patient_alert_contacts")
        .update({ is_active: false })
        .eq("patient_id", userId);

      if (deleteError) throw deleteError;

      // Then insert all current contacts
      const contactsWithUserId = validContacts.map(contact => ({
        contact_type: contact.contact_type,
        contact_name: contact.contact_name,
        phone_number: contact.phone_number || null,
        email: contact.email || null,
        patient_id: userId,
        is_active: true
      }));

      const { error: insertError } = await supabase
        .from("patient_alert_contacts")
        .insert(contactsWithUserId);

      if (insertError) throw insertError;

      toast({
        title: "Sauvegarde réussie",
        description: "Vos contacts d'alerte ont été enregistrés.",
      });

      // Refresh the list to get the server-generated IDs
      await fetchAlertContacts();
    } catch (error: any) {
      console.error("Error saving alert contacts:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos contacts d'alerte.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Fetch alert contacts on component mount
  useEffect(() => {
    console.log("useAlertContacts hook initialized with userId:", userId);
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
