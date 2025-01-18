import { useState } from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import { TrustedPersonForm, type TrustedPerson } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonCard } from "./trusted-persons/TrustedPersonCard";

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

      <TrustedPersonForm
        newPerson={newPerson}
        setNewPerson={setNewPerson}
        addPerson={addPerson}
      />

      <Separator className="my-6" />

      <div className="space-y-4">
        {persons.map((person, index) => (
          <TrustedPersonCard
            key={person.id}
            person={person}
            index={index}
            totalPersons={persons.length}
            onMove={movePerson}
            onRemove={removePerson}
          />
        ))}
      </div>
    </Card>
  );
};