import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ResponseCard } from "./responses/ResponseCard";
import { ResponsesList } from "./responses/ResponsesList";
import { UniqueIdentifier } from "./responses/UniqueIdentifier";
import { formatResponseText } from "./free-text/ResponseFormatter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResponsesSummaryProps {
  userId: string;
}

interface FormattedResponse {
  question: string;
  responses: string[];
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);
  const [freeText, setFreeText] = useState("");
  const { toast } = useToast();

  const saveFreeText = async () => {
    try {
      console.log("[ResponsesSummary] Saving free text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: freeText
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      console.log("[ResponsesSummary] Free text saved successfully");
      toast({
        title: "Succès",
        description: "Votre texte libre a été enregistré.",
      });
    } catch (error) {
      console.error("[ResponsesSummary] Error saving free text:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasErrors) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          Une erreur est survenue lors de la récupération de vos réponses.
        </AlertDescription>
      </Alert>
    );
  }

  const formatResponses = (responseArray: any[]): FormattedResponse[] => {
    if (!responseArray || responseArray.length === 0) {
      return [];
    }
    
    const groupedResponses = responseArray.reduce((acc, curr) => {
      const key = curr.question_id;
      if (!acc[key]) {
        acc[key] = {
          question: curr.question_text || 
                   curr.questions?.Question || 
                   curr.life_support_questions?.question ||
                   curr.advanced_illness_questions?.question ||
                   curr.preferences_questions?.question,
          responses: []
        };
      }
      acc[key].responses.push(formatResponseText(curr.response));
      return acc;
    }, {});

    return Object.values(groupedResponses);
  };

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-8">
        <ResponseCard title="Mon avis d'une façon générale">
          <ResponsesList formattedResponses={formatResponses(responses.general)} />
        </ResponseCard>

        <ResponseCard title="Maintien en vie">
          <ResponsesList formattedResponses={formatResponses(responses.lifeSupport)} />
        </ResponseCard>

        <ResponseCard title="Maladie avancée">
          <ResponsesList formattedResponses={formatResponses(responses.advancedIllness)} />
        </ResponseCard>

        <ResponseCard title="Mes goûts et mes peurs">
          <ResponsesList formattedResponses={formatResponses(responses.preferences)} />
        </ResponseCard>

        <ResponseCard title="Texte libre">
          <div className="space-y-4">
            <Textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="............................................................................................................
............................................................................................................
............................................................................................................
............................................................................................................"
              className="min-h-[120px] resize-none font-mono"
            />
            <Button onClick={saveFreeText} className="w-full">
              Enregistrer
            </Button>
          </div>
        </ResponseCard>

        <UniqueIdentifier userId={userId} />
      </div>
    </ScrollArea>
  );
}