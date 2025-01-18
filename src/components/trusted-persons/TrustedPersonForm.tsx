import { Button } from "@/components/ui/button";
import { PersonalInfo } from "./sections/PersonalInfo";
import { ContactInfo } from "./sections/ContactInfo";
import { DateAndPlace } from "./sections/DateAndPlace";

type TrustedPersonFormProps = {
  newPerson: Omit<TrustedPerson, "id">;
  setNewPerson: (person: Omit<TrustedPerson, "id">) => void;
  addPerson: () => void;
};

export type TrustedPerson = {
  id: number;
  name: string;
  address: string;
  phonePersonal: string;
  phoneProfessional: string;
  email: string;
  date: string;
  place: string;
};

export const TrustedPersonForm = ({
  newPerson,
  setNewPerson,
  addPerson,
}: TrustedPersonFormProps) => {
  return (
    <div className="space-y-6">
      <PersonalInfo newPerson={newPerson} setNewPerson={setNewPerson} />
      <ContactInfo newPerson={newPerson} setNewPerson={setNewPerson} />
      <DateAndPlace newPerson={newPerson} setNewPerson={setNewPerson} />
      <Button onClick={addPerson} className="w-full mt-8">
        Ajouter une personne
      </Button>
    </div>
  );
};