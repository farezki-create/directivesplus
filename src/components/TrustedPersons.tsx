import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type TrustedPerson = {
  id: number;
  name: string;
  phone: string;
  email: string;
  relation: string;
  address: string;
  city: string;
  postalCode: string;
};

export const TrustedPersons = () => {
  const [persons, setPersons] = useState<TrustedPerson[]>([]);
  const [newPerson, setNewPerson] = useState<Omit<TrustedPerson, "id">>({
    name: "",
    phone: "",
    email: "",
    relation: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTrustedPersons();
  }, []);

  const loadTrustedPersons = async () => {
    try {
      console.log("[TrustedPersons] Loading trusted persons");
      const { data: session } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log("[TrustedPersons] No user session found");
        return;
      }

      const { data, error } = await supabase
        .from("trusted_persons")
        .select("*")
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

  const savePerson = async () => {
    if (newPerson.name && newPerson.phone && newPerson.email) {
      try {
        console.log("[TrustedPersons] Saving new trusted person");
        const { data: session } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log("[TrustedPersons] No user session found");
          return;
        }

        const { data, error } = await supabase
          .from("trusted_persons")
          .insert({
            user_id: session.user.id,
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
        setNewPerson({ 
          name: "", 
          phone: "", 
          email: "", 
          relation: "",
          address: "",
          city: "",
          postalCode: "",
        });
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
    }
  };

  const removePerson = async (id: number) => {
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

  const movePerson = async (id: number, direction: "up" | "down") => {
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

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={newPerson.name}
              onChange={e => setNewPerson({ ...newPerson, name: e.target.value })}
              placeholder="Nom de la personne"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={newPerson.phone}
              onChange={e => setNewPerson({ ...newPerson, phone: e.target.value })}
              placeholder="Numéro de téléphone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newPerson.email}
              onChange={e => setNewPerson({ ...newPerson, email: e.target.value })}
              placeholder="Adresse email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relation">Relation</Label>
            <Input
              id="relation"
              value={newPerson.relation}
              onChange={e => setNewPerson({ ...newPerson, relation: e.target.value })}
              placeholder="Lien avec la personne"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={newPerson.address}
              onChange={e => setNewPerson({ ...newPerson, address: e.target.value })}
              placeholder="Adresse postale"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={newPerson.city}
              onChange={e => setNewPerson({ ...newPerson, city: e.target.value })}
              placeholder="Ville"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              value={newPerson.postalCode}
              onChange={e => setNewPerson({ ...newPerson, postalCode: e.target.value })}
              placeholder="Code postal"
            />
          </div>
        </div>
        <Button onClick={savePerson} className="w-full">
          Enregistrer
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        {persons.map((person, index) => (
          <Card key={person.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {person.phone} - {person.email}
                </p>
                <p className="text-sm text-muted-foreground">{person.relation}</p>
                <p className="text-sm text-muted-foreground">
                  {person.address}, {person.city} {person.postalCode}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePerson(person.id, "up")}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePerson(person.id, "down")}
                  disabled={index === persons.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePerson(person.id)}
                >
                  ×
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};