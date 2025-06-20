
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
      
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("User not authenticated");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("patient_alert_contacts")
        .select("*")
        .eq("patient_id", userId)
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
        description: "Impossible de charger vos contacts d'alerte. Veuillez réessayer.",
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
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non identifié. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Saving alert contacts for user:", userId);
      setSaving(true);

      // Verify user is still authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Session expirée",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        return;
      }

      // Filter out invalid entries (must have at least a name and contact method)
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

      // First delete all existing contacts for this user by marking them as inactive
      const { error: deleteError } = await supabase
        .from("patient_alert_contacts")
        .update({ is_active: false })
        .eq("patient_id", userId);

      if (deleteError) {
        console.error("Error deactivating old contacts:", deleteError);
        throw deleteError;
      }

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

      if (insertError) {
        console.error("Error inserting new contacts:", insertError);
        throw insertError;
      }

      toast({
        title: "Sauvegarde réussie",
        description: "Vos contacts d'alerte ont été enregistrés avec succès.",
      });

      // Refresh the list to get the server-generated IDs
      await fetchAlertContacts();
    } catch (error: any) {
      console.error("Error saving alert contacts:", error);
      
      // Provide more specific error messages
      let errorMessage = "Impossible d'enregistrer vos contacts d'alerte.";
      
      if (error.code === 'PGRST301') {
        errorMessage = "Problème de permissions. Veuillez vous reconnecter.";
      } else if (error.message?.includes('policy')) {
        errorMessage = "Erreur de permissions de base de données.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Problème de connexion réseau.";
      }
      
      toast({
        title: "Erreur de sauvegarde",
        description: errorMessage + " Vérifiez votre connexion et réessayez.",
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
