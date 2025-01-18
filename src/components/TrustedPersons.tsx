import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrustedPersonForm } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonsList } from "./trusted-persons/TrustedPersonsList";
import type { TrustedPerson, NewTrustedPerson } from "@/types/trusted-person";

export const TrustedPersons = () => {
  const [persons, setPersons] = useState<TrustedPerson[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTrustedPersons();
  }, []);

  const loadTrustedPersons = async () => {
    try {
      console.log("[TrustedPersons] Loading trusted persons");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("[TrustedPersons] Session error:", sessionError);
        throw sessionError;
      }

      if (!sessionData?.session?.user) {
        console.log("[TrustedPersons] No user session found");
        return;
      }

      const { data, error } = await supabase
        .from("trusted_persons")
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[TrustedPersons] Error loading trusted persons:", error);
        throw error;
      }

      console.log("[TrustedPersons] Loaded trusted persons:", data);
      setPersons(data.map(p => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        email: p.email,
        relation: p.relation || "",
        address: p.address || "",
        city: p.city || "",
        postalCode: p.postal_code || "",
      })));
    } catch (error) {
      console.error("[TrustedPersons] Error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les personnes de confiance.",
        variant: "destructive",
      });
    }
  };

  const savePerson = async (newPerson: NewTrustedPerson) => {
    try {
      console.log("[TrustedPersons] Saving new trusted person");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("[TrustedPersons] Session error:", sessionError);
        throw sessionError;
      }

      if (!sessionData?.session?.user) {
        console.log("[TrustedPersons] No user session found");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer une personne de confiance.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("trusted_persons")
        .insert({
          user_id: sessionData.session.user.id,
          name: newPerson.name,
          phone: newPerson.phone,
          email: newPerson.email,
          relation: newPerson.relation,
          address: newPerson.address,
          city: newPerson.city,
          postal_code: newPerson.postalCode,
        })
        .select()
        .single();

      if (error) {
        console.error("[TrustedPersons] Error saving trusted person:", error);
        throw error;
      }

      console.log("[TrustedPersons] Saved trusted person:", data);
      await loadTrustedPersons();
      toast({
        title: "Succès",
        description: "La personne de confiance a été enregistrée.",
      });
    } catch (error) {
      console.error("[TrustedPersons] Error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la personne de confiance.",
        variant: "destructive",
      });
    }
  };

  const removePerson = async (id: string) => {
    try {
      console.log("[TrustedPersons] Removing trusted person:", id);
      const { error } = await supabase
        .from("trusted_persons")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[TrustedPersons] Error removing trusted person:", error);
        throw error;
      }

      console.log("[TrustedPersons] Removed trusted person:", id);
      await loadTrustedPersons();
      toast({
        title: "Succès",
        description: "La personne de confiance a été supprimée.",
      });
    } catch (error) {
      console.error("[TrustedPersons] Error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la personne de confiance.",
        variant: "destructive",
      });
    }
  };

  const movePerson = (id: string, direction: "up" | "down") => {
    const index = persons.findIndex(person => person.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < persons.length - 1)
    ) {
      const newPersons = [...persons];
      const temp = newPersons[index];
      newPersons[index] = newPersons[index + (direction === "up" ? -1 : 1)];
      newPersons[index + (direction === "up" ? -1 : 1)] = temp;
      setPersons(newPersons);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Personnes de confiance</h2>
      <TrustedPersonForm onSave={savePerson} />
      <Separator className="my-6" />
      <TrustedPersonsList
        persons={persons}
        onMove={movePerson}
        onRemove={removePerson}
      />
    </Card>
  );
};