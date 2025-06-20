
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AlertContact } from "@/hooks/alerts/types";
import { AlertContactForm } from "./AlertContactFormCard";

interface AlertContactCardProps {
  contact: AlertContact;
  index: number;
  onChange: (index: number, field: keyof AlertContact, value: string) => void;
  onRemove: (index: number) => void;
}

export const AlertContactCard = ({ contact, index, onChange, onRemove }: AlertContactCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">
          Contact d'alerte {index + 1}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <AlertContactForm 
          contact={contact}
          index={index}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
