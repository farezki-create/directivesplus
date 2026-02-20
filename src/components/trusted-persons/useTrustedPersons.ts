
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TrustedPerson } from "./types";

export const useTrustedPersons = (userId: string | undefined) => {
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTrustedPersons = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("trusted_persons")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTrustedPersons(data || []);
    } catch (error: any) {
      console.error("Error fetching trusted persons:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos personnes de confiance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = () => {
    const newPerson: Omit<TrustedPerson, "id"> = {
      name: "",
      phone: "",
      email: "",
      relation: "",
      address: "",
      city: "",
      postal_code: "",
    };
    
    setTrustedPersons([...trustedPersons, { ...newPerson, id: `temp-${Date.now()}` }]);
  };

  const handleChange = (index: number, field: keyof TrustedPerson, value: string) => {
    const updatedPersons = [...trustedPersons];
    updatedPersons[index] = {
      ...updatedPersons[index],
      [field]: value,
    };
    setTrustedPersons(updatedPersons);
  };

  const handleRemove = (index: number) => {
    const updatedPersons = [...trustedPersons];
    updatedPersons.splice(index, 1);
    setTrustedPersons(updatedPersons);
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      setSaving(true);

      const validPersons = trustedPersons.filter(person => person.name.trim() !== "");
      
      if (validPersons.length === 0) {
        await fetchTrustedPersons();
        return;
      }

      const { error: deleteError } = await supabase
        .from("trusted_persons")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      const personsWithUserId = validPersons.map(person => ({
        name: person.name,
        phone: person.phone || null,
        email: person.email || null,
        relation: person.relation || null,
        address: person.address || null,
        city: person.city || null,
        postal_code: person.postal_code || null,
        user_id: userId,
      }));

      const { error: insertError } = await supabase
        .from("trusted_persons")
        .insert(personsWithUserId);

      if (insertError) throw insertError;

      toast({
        title: "Sauvegarde réussie",
        description: "Vos personnes de confiance ont été enregistrées.",
      });

      await fetchTrustedPersons();
    } catch (error: any) {
      console.error("Error saving trusted persons:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos personnes de confiance.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTrustedPersons();
  }, [userId]);

  return {
    trustedPersons,
    loading,
    saving,
    handleAddPerson,
    handleChange,
    handleRemove,
    handleSave
  };
};
