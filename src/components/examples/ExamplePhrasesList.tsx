
import { ExamplePhraseCard } from "./ExamplePhraseCard";
import { ConfirmationDialog, ConfirmDialogState } from "./ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/hooks/language";

export interface ExamplePhrase {
  text: string;
  text_en?: string;
}

interface ExamplePhrasesListProps {
  phrases: ExamplePhrase[];
  onBack: () => void;
  onAddToSynthesis: (phrase: string) => Promise<void>;
  onRemoveFromSynthesis: (phrase: string) => Promise<void>;
}

export function ExamplePhrasesList({
  phrases,
  onBack,
  onAddToSynthesis,
  onRemoveFromSynthesis
}: ExamplePhrasesListProps) {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ 
    isOpen: false, 
    type: 'add', 
    phrase: '' 
  });
  const { t } = useLanguage();

  const handleAddToSynthesis = (phrase: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'add',
      phrase
    });
  };

  const handleRemoveFromSynthesis = (phrase: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'remove',
      phrase
    });
  };

  const handleConfirm = async () => {
    if (confirmDialog.type === 'add') {
      await onAddToSynthesis(confirmDialog.phrase);
    } else {
      await onRemoveFromSynthesis(confirmDialog.phrase);
    }
    setConfirmDialog({ isOpen: false, type: 'add', phrase: '' });
  };
  
  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, type: 'add', phrase: '' });
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setConfirmDialog(prev => ({ ...prev, isOpen }));
  };

  return (
    <div className="space-y-6">
      <Button 
        onClick={onBack} 
        variant="outline" 
        className="mb-4"
      >
        {t('back')}
      </Button>
      <div className="space-y-4">
        {phrases.map((phrase, index) => (
          <ExamplePhraseCard
            key={index}
            text={phrase.text}
            text_en={phrase.text_en}
            onAddToSynthesis={handleAddToSynthesis}
            onRemoveFromSynthesis={handleRemoveFromSynthesis}
          />
        ))}
      </div>

      <ConfirmationDialog 
        dialogState={confirmDialog}
        onOpenChange={handleDialogOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
