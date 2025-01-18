import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type TrustedPerson } from "./TrustedPersonForm";

type TrustedPersonCardProps = {
  person: TrustedPerson;
  index: number;
  totalPersons: number;
  onMove: (id: number, direction: "up" | "down") => void;
  onRemove: (id: number) => void;
};

export const TrustedPersonCard = ({
  person,
  index,
  totalPersons,
  onMove,
  onRemove,
}: TrustedPersonCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold">{person.name}</h3>
          <p className="text-sm text-muted-foreground">
            Domicile: {person.address}
          </p>
          <p className="text-sm text-muted-foreground">
            Tél privé: {person.phonePersonal} - Tél pro: {person.phoneProfessional}
          </p>
          <p className="text-sm text-muted-foreground">
            Email: {person.email}
          </p>
          <p className="text-sm text-muted-foreground">
            Fait le {format(new Date(person.date), "d MMMM yyyy", { locale: fr })} à {person.place}
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
            disabled={index === totalPersons - 1}
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
  );
};