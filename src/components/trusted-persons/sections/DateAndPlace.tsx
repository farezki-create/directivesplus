import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrustedPerson } from "../TrustedPersonForm";

type DateAndPlaceProps = {
  newPerson: Omit<TrustedPerson, "id">;
  setNewPerson: (person: Omit<TrustedPerson, "id">) => void;
};

export const DateAndPlace = ({ newPerson, setNewPerson }: DateAndPlaceProps) => {
  return (
    <>
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

      <div>
        <p className="mb-4">Votre signature</p>
        <div className="border-b-2 border-dotted border-gray-400 h-16"></div>
      </div>
    </>
  );
};