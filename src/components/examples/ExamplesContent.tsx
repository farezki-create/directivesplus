
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplatesList } from "./TemplatesList";
import { ExamplePhrasesList } from "./ExamplePhrasesList";
import { examplePhrases } from "./data/examplePhrases";
import { addPhraseToSynthesis, removePhraseFromSynthesis } from "./utils/synthesisUtils";

interface ExamplesContentProps {
  onBack: () => void;
}

export function ExamplesContent({ onBack }: ExamplesContentProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const { toast } = useToast();

  const handleAddToSynthesis = async (phrase: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une phrase à votre synthèse",
          variant: "destructive",
        });
        return;
      }

      const result = await addPhraseToSynthesis(phrase, session.user.id);
      
      if (result.isDuplicate) {
        toast({
          title: "Information",
          description: "Cette phrase est déjà présente dans votre synthèse",
        });
        return;
      }

      if (result.success) {
        toast({
          title: "Succès",
          description: "La phrase a été ajoutée à votre synthèse",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la phrase:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la phrase à votre synthèse",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromSynthesis = async (phrase: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour modifier votre synthèse",
          variant: "destructive",
        });
        return;
      }

      const result = await removePhraseFromSynthesis(phrase, session.user.id);
      
      if (result.notFound) {
        toast({
          title: "Information",
          description: "Cette phrase n'est pas présente dans votre synthèse",
        });
        return;
      }

      if (result.success) {
        toast({
          title: "Succès",
          description: "La phrase a été retirée de votre synthèse",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la phrase:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer la phrase de votre synthèse",
        variant: "destructive",
      });
    }
  };

  if (showPhrases) {
    return (
      <ExamplePhrasesList
        phrases={examplePhrases}
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
          Retour
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowTemplates(true)}
          >
            <h3 className="text-lg font-semibold">Propositions de modèles pré-remplis</h3>
          </Button>

          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowPhrases(true)}
          >
            <h3 className="text-lg font-semibold">Exemples de phrases à utiliser</h3>
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
        Retour
      </Button>
      <TemplatesList />
    </div>
  );
}
