import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrustedPerson } from "../TrustedPersonForm";

type ContactInfoProps = {
  newPerson: Omit<TrustedPerson, "id">;
  setNewPerson: (person: Omit<TrustedPerson, "id">) => void;
};

export const ContactInfo = ({ newPerson, setNewPerson }: ContactInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Coordonnées</h3>
      <div className="grid grid-cols-2 gap-4">
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
  );
};