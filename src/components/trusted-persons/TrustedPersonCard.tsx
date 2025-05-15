
import { ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { TrustedPerson } from "./types";

interface TrustedPersonCardProps {
  person: TrustedPerson;
  index: number;
  onChange: (index: number, field: keyof TrustedPerson, value: string) => void;
  onRemove: (index: number) => void;
}

export const TrustedPersonCard = ({ person, index, onChange, onRemove }: TrustedPersonCardProps) => {
  const handleChange = (field: keyof TrustedPerson) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange(index, field, e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {index === 0 ? "Personne de confiance principale" : `Personne de confiance ${index + 1}`}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-8 w-8 text-red-500 hover:text-red-700"
          >
            <Trash size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Nom complet *</Label>
              <Input
                id={`name-${index}`}
                value={person.name}
                onChange={handleChange("name")}
                placeholder="Nom et prénom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`relation-${index}`}>Relation</Label>
              <Input
                id={`relation-${index}`}
                value={person.relation || ""}
                onChange={handleChange("relation")}
                placeholder="Ex: Conjoint, Enfant, Ami"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Téléphone</Label>
              <Input
                id={`phone-${index}`}
                value={person.phone || ""}
                onChange={handleChange("phone")}
                placeholder="Numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`email-${index}`}>Email</Label>
              <Input
                id={`email-${index}`}
                value={person.email || ""}
                onChange={handleChange("email")}
                placeholder="Adresse email"
                type="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`address-${index}`}>Adresse</Label>
            <Input
              id={`address-${index}`}
              value={person.address || ""}
              onChange={handleChange("address")}
              placeholder="Adresse"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`postal_code-${index}`}>Code postal</Label>
              <Input
                id={`postal_code-${index}`}
                value={person.postal_code || ""}
                onChange={handleChange("postal_code")}
                placeholder="Code postal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`city-${index}`}>Ville</Label>
              <Input
                id={`city-${index}`}
                value={person.city || ""}
                onChange={handleChange("city")}
                placeholder="Ville"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
