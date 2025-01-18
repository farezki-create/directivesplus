import { Button } from "../ui/button";
import { Card } from "../ui/card";
import type { TrustedPerson } from "@/types/trusted-person";

interface TrustedPersonsListProps {
  persons: TrustedPerson[];
  onRemove: (id: string) => Promise<void>;
}

export const TrustedPersonsList = ({ persons, onRemove }: TrustedPersonsListProps) => {
  if (persons.length === 0) return null;
  
  const person = persons[0]; // We only show the first person

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{person.name}</h3>
            <p className="text-sm text-muted-foreground">
              {person.phone} - {person.email}
            </p>
            <p className="text-sm text-muted-foreground">{person.relation}</p>
            <p className="text-sm text-muted-foreground">
              {person.address}, {person.city} {person.postalCode}
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
    </div>
  );
};