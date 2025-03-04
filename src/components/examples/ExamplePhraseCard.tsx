
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/language";

interface ExamplePhraseCardProps {
  text: string;
  text_en?: string;
  onAddToSynthesis: (phrase: string) => void;
  onRemoveFromSynthesis: (phrase: string) => void;
}

export function ExamplePhraseCard({ 
  text, 
  text_en,
  onAddToSynthesis, 
  onRemoveFromSynthesis 
}: ExamplePhraseCardProps) {
  const { t, currentLanguage } = useLanguage();
  
  // Display English text if language is English and text_en exists, otherwise display French text
  const displayText = currentLanguage === 'en' && text_en ? text_en : text;
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{displayText}</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToSynthesis(displayText)}
          >
            {t('addToSynthesis')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveFromSynthesis(displayText)}
          >
            {t('removeFromSynthesis')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
