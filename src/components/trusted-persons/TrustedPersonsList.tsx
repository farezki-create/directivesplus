import { Button } from "../ui/button";
import { Card } from "../ui/card";
import type { TrustedPerson } from "@/types/trusted-person";

interface TrustedPersonsListProps {
  persons: TrustedPerson[];
  onMove: (id: string, direction: "up" | "down") => void;
  onRemove: (id: string) => Promise<void>;
}

export const TrustedPersonsList = ({ persons, onMove, onRemove }: TrustedPersonsListProps) => {
  return (
    <div className="space-y-4">
      {persons.map((person, index) => (
        <Card key={person.id} className="p-4">
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
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMove(person.id, "up")}
                disabled={index === 0}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMove(person.id, "down")}
                disabled={index === persons.length - 1}
              >
                ↓
              </Button>
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