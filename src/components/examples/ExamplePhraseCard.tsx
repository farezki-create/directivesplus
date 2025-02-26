
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ExamplePhraseCardProps {
  text: string;
  onAddToSynthesis: (phrase: string) => void;
  onRemoveFromSynthesis: (phrase: string) => void;
}

export function ExamplePhraseCard({ 
  text, 
  onAddToSynthesis, 
  onRemoveFromSynthesis 
}: ExamplePhraseCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{text}</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToSynthesis(text)}
          >
            Ajouter à ma synthèse
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveFromSynthesis(text)}
          >
            Supprimer de ma synthèse
          </Button>
        </div>
      </div>
    </Card>
  );
}
