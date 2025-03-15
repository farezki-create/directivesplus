
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import type { TrustedPerson } from "@/types/trusted-person";

interface TrustedPersonsListProps {
  persons: TrustedPerson[];
  onRemove: (id: string) => Promise<void>;
}

export const TrustedPersonsList = ({ persons, onRemove }: TrustedPersonsListProps) => {
  if (persons.length === 0) return null;
  
  return (
    <div className="space-y-4">
      {persons.map(person => (
        <Card key={person.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{person.name}</h3>
              <p className="text-sm text-muted-foreground">
                {person.phone} - {person.email}
              </p>
              <p className="text-sm text-muted-foreground">{person.relation}</p>
              <p className="text-sm text-muted-foreground">
                {person.address}, {person.city} {person.postal_code}
              </p>
            </div>
            <div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(person.id)}
              >
                ×
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
