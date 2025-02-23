
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExamplesContentProps {
  onBack: () => void;
}

export function ExamplesContent({ onBack }: ExamplesContentProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const { toast } = useToast();

  const examplePhrases = [
    {
      text: "En cas d'arrêt cardiaque avec pronostic neurologique incertain, je refuse les manœuvres de réanimation et la ventilation mécanique prolongée, privilégiant une prise en charge palliative",
    }
  ];

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

      // Récupérer la synthèse existante
      const { data: existingSynthesis } = await supabase
        .from('questionnaire_synthesis')
        .select('free_text')
        .eq('user_id', session.user.id)
        .single();

      // Préparer le nouveau texte
      const currentText = existingSynthesis?.free_text || '';
      const updatedText = currentText + (currentText ? '\n\n' : '') + phrase;

      // Mettre à jour la synthèse
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          free_text: updatedText
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La phrase a été ajoutée à votre synthèse",
      });
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

      // Récupérer la synthèse existante
      const { data: existingSynthesis } = await supabase
        .from('questionnaire_synthesis')
        .select('free_text')
        .eq('user_id', session.user.id)
        .single();

      if (!existingSynthesis?.free_text) {
        toast({
          title: "Information",
          description: "Cette phrase n'est pas présente dans votre synthèse",
        });
        return;
      }

      // Retirer la phrase de la synthèse
      const updatedText = existingSynthesis.free_text
        .replace(phrase, '')
        .replace(/\n\n\n/g, '\n\n')
        .trim();

      // Mettre à jour la synthèse
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          free_text: updatedText
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La phrase a été retirée de votre synthèse",
      });
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
      <div className="space-y-6">
        <Button 
          onClick={() => setShowPhrases(false)} 
          variant="outline" 
          className="mb-4"
        >
          Retour
        </Button>
        <div className="space-y-4">
          {examplePhrases.map((phrase, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{phrase.text}</p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToSynthesis(phrase.text)}
                  >
                    Ajouter à ma synthèse
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromSynthesis(phrase.text)}
                  >
                    Supprimer de ma synthèse
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
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
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Plus de soins thérapeutiques</h3>
            <p className="text-sm text-gray-600">
              Exemple de directives anticipées privilégiant les soins thérapeutiques actifs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Plus de soulagement des souffrances</h3>
            <p className="text-sm text-gray-600">
              Exemple de directives anticipées privilégiant le confort et le soulagement de la douleur.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Intermédiaire, Soins thérapeutiques et soulagement</h3>
            <p className="text-sm text-gray-600">
              Exemple équilibré entre les soins thérapeutiques et le soulagement des souffrances.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
