
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ExamplePhraseCardProps {
  content: string;
  onAdd?: (phrase: string) => void;
  onRemove?: (phrase: string) => void;
}

const ExamplePhraseCard = ({ content, onAdd, onRemove }: ExamplePhraseCardProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddRemove = () => {
    if (isAdded) {
      onRemove?.(content);
      toast({
        title: "Phrase supprimée",
        description: "La phrase a été supprimée de vos directives",
      });
      setIsAdded(false);
    } else {
      onAdd?.(content);
      toast({
        title: "Phrase ajoutée",
        description: "La phrase a été ajoutée à vos directives",
      });
      setIsAdded(true);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="prose max-w-none">
            <p>{content}</p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddRemove}
              variant={isAdded ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isAdded ? <Minus size={16} /> : <Plus size={16} />}
              {isAdded ? "Supprimer" : "Ajouter"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamplePhraseCard;
