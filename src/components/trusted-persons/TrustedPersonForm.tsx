import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

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
  hasBeenInformed: boolean;
  hasDirectivesCopy: boolean;
  date: string;
  place: string;
};

export const TrustedPersonForm = ({
  newPerson,
  setNewPerson,
  addPerson,
}: TrustedPersonFormProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <p className="mb-4">Je soussigné(e) nom, prénoms, date et lieu de naissance</p>
        <div className="border-b-2 border-dotted border-gray-400 mb-4 h-8"></div>
        <div className="border-b-2 border-dotted border-gray-400 mb-4 h-8"></div>
      </div>

      <p className="mb-4">désigne la personne de confiance suivante :</p>

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
  );
};