
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();
  
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
            {t('addToSynthesis')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveFromSynthesis(text)}
          >
            {t('removeFromSynthesis')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
