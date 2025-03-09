
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplatesList } from "./TemplatesList";
import { ExamplePhrasesList } from "./ExamplePhrasesList";
import { examplePhrases } from "./data/examplePhrases";
import { examplePhrasesEn } from "./data/examplePhrasesEn";
import { addPhraseToSynthesis, removePhraseFromSynthesis } from "./utils/synthesisUtils";
import { useLanguage } from "@/hooks/useLanguage";

interface ExamplesContentProps {
  onBack: () => void;
}

export function ExamplesContent({ onBack }: ExamplesContentProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  const handleAddToSynthesis = async (phrase: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: t('error'),
          description: t('mustBeLoggedIn'),
          variant: "destructive",
        });
        return;
      }

      const result = await addPhraseToSynthesis(phrase, session.user.id);
      
      if (result.isDuplicate) {
        toast({
          title: t('information'),
          description: t('phraseAlreadyExists'),
        });
        return;
      }

      if (result.success) {
        toast({
          title: t('success'),
          description: t('phraseAdded'),
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la phrase:", error);
      toast({
        title: t('error'),
        description: t('errorAddingPhrase'),
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromSynthesis = async (phrase: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: t('error'),
          description: t('mustBeLoggedIn'),
          variant: "destructive",
        });
        return;
      }

      const result = await removePhraseFromSynthesis(phrase, session.user.id);
      
      if (result.notFound) {
        toast({
          title: t('information'),
          description: t('phraseNotFound'),
        });
        return;
      }

      if (result.success) {
        toast({
          title: t('success'),
          description: t('phraseRemoved'),
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la phrase:", error);
      toast({
        title: t('error'),
        description: t('errorRemovingPhrase'),
        variant: "destructive",
      });
    }
  };

  // Use language-appropriate example phrases
  const phrases = currentLanguage === 'en' ? examplePhrasesEn : examplePhrases;

  if (showPhrases) {
    return (
      <ExamplePhrasesList
        phrases={phrases}
        onBack={() => setShowPhrases(false)}
        onAddToSynthesis={handleAddToSynthesis}
        onRemoveFromSynthesis={handleRemoveFromSynthesis}
      />
    );
  }

  if (!showTemplates) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="mb-4"
        >
          {t('back')}
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowTemplates(true)}
          >
            <h3 className="text-lg font-semibold">{t('templatesTitle')}</h3>
          </Button>

          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowPhrases(true)}
          >
            <h3 className="text-lg font-semibold">{t('phrasesTitle')}</h3>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={() => setShowTemplates(false)} 
        variant="outline" 
        className="mb-4"
      >
        {t('back')}
      </Button>
      <TemplatesList />
    </div>
  );
}
