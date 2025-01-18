import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrustedPerson } from "../TrustedPersonForm";

type PersonalInfoProps = {
  newPerson: Omit<TrustedPerson, "id">;
  setNewPerson: (person: Omit<TrustedPerson, "id">) => void;
};

export const PersonalInfo = ({ newPerson, setNewPerson }: PersonalInfoProps) => {
  return (
    <>
      <div className="mb-8">
        <p className="mb-4">Je soussigné(e)</p>
        <div className="border-b-2 border-dotted border-gray-400 mb-4 h-8"></div>
      </div>

      <p className="mb-4">désigne la personne de confiance suivante :</p>

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
    </>
  );
};