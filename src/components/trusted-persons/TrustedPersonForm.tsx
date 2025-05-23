
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrustedPerson } from "./types";

interface TrustedPersonFormProps {
  person: TrustedPerson;
  index: number;
  onChange: (index: number, field: keyof TrustedPerson, value: string) => void;
}

export const TrustedPersonForm = ({ person, index, onChange }: TrustedPersonFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`name-${index}`}>Nom et prénom *</Label>
          <Input
            id={`name-${index}`}
            value={person.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            placeholder="Nom et prénom"
            required
          />
        </div>
        <div>
          <Label htmlFor={`relation-${index}`}>Relation</Label>
          <Input
            id={`relation-${index}`}
            value={person.relation}
            onChange={(e) => onChange(index, 'relation', e.target.value)}
            placeholder="Ex: Époux/Épouse, Enfant, Ami..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`phone-${index}`}>Téléphone</Label>
          <Input
            id={`phone-${index}`}
            value={person.phone}
            onChange={(e) => onChange(index, 'phone', e.target.value)}
            placeholder="Numéro de téléphone"
            type="tel"
          />
        </div>
        <div>
          <Label htmlFor={`email-${index}`}>Email</Label>
          <Input
            id={`email-${index}`}
            value={person.email}
            onChange={(e) => onChange(index, 'email', e.target.value)}
            placeholder="Adresse email"
            type="email"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`address-${index}`}>Adresse</Label>
        <Input
          id={`address-${index}`}
          value={person.address}
          onChange={(e) => onChange(index, 'address', e.target.value)}
          placeholder="Adresse complète"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`city-${index}`}>Ville</Label>
          <Input
            id={`city-${index}`}
            value={person.city}
            onChange={(e) => onChange(index, 'city', e.target.value)}
            placeholder="Ville"
          />
        </div>
        <div>
          <Label htmlFor={`postal_code-${index}`}>Code postal</Label>
          <Input
            id={`postal_code-${index}`}
            value={person.postal_code}
            onChange={(e) => onChange(index, 'postal_code', e.target.value)}
            placeholder="Code postal"
          />
        </div>
      </div>
    </div>
  );
};
