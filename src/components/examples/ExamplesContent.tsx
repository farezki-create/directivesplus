import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExamplePhrasesList } from "./ExamplePhrasesList";
import { examplePhrases } from "./data/examplePhrases";
import { examplePhrasesEn } from "./data/examplePhrasesEn";
import { addPhraseToSynthesis, removePhraseFromSynthesis } from "./utils/synthesisUtils";
import { useLanguage } from "@/hooks/useLanguage";

interface ExamplesContentProps {
  onBack: () => void;
}

export function ExamplesContent({ onBack }: ExamplesContentProps) {
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

  return (
    <ExamplePhrasesList
      phrases={phrases}
      onBack={onBack}
      onAddToSynthesis={handleAddToSynthesis}
      onRemoveFromSynthesis={handleRemoveFromSynthesis}
    />
  );
}
