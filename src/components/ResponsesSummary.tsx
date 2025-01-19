import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ResponseCard } from "./responses/ResponseCard";
import { ResponsesList } from "./responses/ResponsesList";
import { UniqueIdentifier } from "./responses/UniqueIdentifier";
import { formatResponseText } from "./free-text/ResponseFormatter";

interface ResponsesSummaryProps {
  userId: string;
}

interface FormattedResponse {
  question: string;
  responses: string[];
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);

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

        {responses.synthesis && (
          <ResponseCard title="Synthèse et expression libre">
            <p className="whitespace-pre-wrap">
              {responses.synthesis.free_text || "Aucune synthèse saisie"}
            </p>
          </ResponseCard>
        )}

        <UniqueIdentifier userId={userId} />
      </div>
    </ScrollArea>
  );
}