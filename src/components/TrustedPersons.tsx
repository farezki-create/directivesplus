import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type TrustedPerson = {
  id: number;
  name: string;
  phone: string;
  email: string;
  relation: string;
};

export const TrustedPersons = () => {
  const [persons, setPersons] = useState<TrustedPerson[]>([]);
  const [newPerson, setNewPerson] = useState<Omit<TrustedPerson, "id">>({
    name: "",
    phone: "",
    email: "",
    relation: "",
  });

  const savePerson = () => {
    if (newPerson.name && newPerson.phone && newPerson.email) {
      setPersons([...persons, { ...newPerson, id: Date.now() }]);
      setNewPerson({ name: "", phone: "", email: "", relation: "" });
    }
  };

  const removePerson = (id: number) => {
    setPersons(persons.filter(person => person.id !== id));
  };

  const movePerson = (id: number, direction: "up" | "down") => {
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