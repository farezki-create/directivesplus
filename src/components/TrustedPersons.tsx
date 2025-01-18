import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type TrustedPerson = {
  id: number;
  name: string;
  address: string;
  phonePersonal: string;
  phoneProfessional: string;
  email: string;
  hasBeenInformed: boolean;
  hasDirectivesCopy: boolean;
  date: string;
  place: string;
};

export const TrustedPersons = () => {
  const [persons, setPersons] = useState<TrustedPerson[]>([]);
  const [newPerson, setNewPerson] = useState<Omit<TrustedPerson, "id">>({
    name: "",
    address: "",
    phonePersonal: "",
    phoneProfessional: "",
    email: "",
    hasBeenInformed: false,
    hasDirectivesCopy: false,
    date: format(new Date(), "yyyy-MM-dd"),
    place: "",
  });

  const addPerson = () => {
    if (newPerson.name && newPerson.phonePersonal && newPerson.email) {
      setPersons([...persons, { ...newPerson, id: Date.now() }]);
      setNewPerson({
        name: "",
        address: "",
        phonePersonal: "",
        phoneProfessional: "",
        email: "",
        hasBeenInformed: false,
        hasDirectivesCopy: false,
        date: format(new Date(), "yyyy-MM-dd"),
        place: "",
      });
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
    <Card className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Désignation de la personne de confiance</h2>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <p className="mb-4">Je soussigné(e) nom, prénoms, date et lieu de naissance</p>
        <div className="border-b-2 border-dotted border-gray-400 mb-4 h-8"></div>
        <div className="border-b-2 border-dotted border-gray-400 mb-4 h-8"></div>
      </div>

      <p className="mb-4">désigne la personne de confiance suivante :</p>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom et prénoms</Label>
            <Input
              id="name"
              value={newPerson.name}
              onChange={e => setNewPerson({ ...newPerson, name: e.target.value })}
              placeholder="Nom et prénoms"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Domicilié(e) à</Label>
            <Input
              id="address"
              value={newPerson.address}
              onChange={e => setNewPerson({ ...newPerson, address: e.target.value })}
              placeholder="Adresse"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phonePersonal">Téléphone privé</Label>
            <Input
              id="phonePersonal"
              value={newPerson.phonePersonal}
              onChange={e => setNewPerson({ ...newPerson, phonePersonal: e.target.value })}
              placeholder="Téléphone privé"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneProfessional">Téléphone professionnel</Label>
            <Input
              id="phoneProfessional"
              value={newPerson.phoneProfessional}
              onChange={e => setNewPerson({ ...newPerson, phoneProfessional: e.target.value })}
              placeholder="Téléphone professionnel"
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasBeenInformed"
              checked={newPerson.hasBeenInformed}
              onCheckedChange={(checked) => 
                setNewPerson({ ...newPerson, hasBeenInformed: checked as boolean })
              }
            />
            <Label htmlFor="hasBeenInformed">
              Je lui ai fait part de mes directives anticipées ou de mes volontés si un jour je ne suis plus en état de m'exprimer
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDirectivesCopy"
              checked={newPerson.hasDirectivesCopy}
              onCheckedChange={(checked) => 
                setNewPerson({ ...newPerson, hasDirectivesCopy: checked as boolean })
              }
            />
            <Label htmlFor="hasDirectivesCopy">
              Elle possède un exemplaire de mes directives anticipées
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fait le</Label>
            <Input
              id="date"
              type="date"
              value={newPerson.date}
              onChange={e => setNewPerson({ ...newPerson, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="place">à</Label>
            <Input
              id="place"
              value={newPerson.place}
              onChange={e => setNewPerson({ ...newPerson, place: e.target.value })}
              placeholder="Lieu"
            />
          </div>
        </div>

        <Button onClick={addPerson} className="w-full">
          Ajouter une personne
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        {persons.map((person, index) => (
          <Card key={person.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Domicile: {person.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tél privé: {person.phonePersonal} - Tél pro: {person.phoneProfessional}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {person.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Informé(e) des directives: {person.hasBeenInformed ? "Oui" : "Non"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Possède une copie: {person.hasDirectivesCopy ? "Oui" : "Non"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fait le {format(new Date(person.date), "d MMMM yyyy", { locale: fr })} à {person.place}
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