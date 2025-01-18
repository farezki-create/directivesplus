import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { NewTrustedPerson } from "@/types/trusted-person";

interface TrustedPersonFormProps {
  onSave: (person: NewTrustedPerson) => Promise<void>;
}

export const TrustedPersonForm = ({ onSave }: TrustedPersonFormProps) => {
  const [newPerson, setNewPerson] = useState<NewTrustedPerson>({
    name: "",
    phone: "",
    email: "",
    relation: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleSubmit = async () => {
    if (newPerson.name && newPerson.phone && newPerson.email) {
      await onSave(newPerson);
      setNewPerson({
        name: "",
        phone: "",
        email: "",
        relation: "",
        address: "",
        city: "",
        postalCode: "",
      });
    }
  };

  return (
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
      <Button onClick={handleSubmit} className="w-full">
        Enregistrer
      </Button>
    </div>
  );
};