import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

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
    
    // Group responses by question
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
      acc[key].responses.push(curr.response);
      return acc;
    }, {});

    return Object.values(groupedResponses);
  };

  const renderResponsesList = (formattedResponses: FormattedResponse[]) => {
    if (formattedResponses.length === 0) {
      return <p className="text-muted-foreground">Aucune réponse</p>;
    }

    return (
      <ul className="space-y-4">
        {formattedResponses.map((item: FormattedResponse, index: number) => (
          <li key={index} className="border-b pb-2">
            <p className="font-medium">{item.question}</p>
            <div className="text-muted-foreground">
              {item.responses.map((response: string, idx: number) => (
                <p key={idx}>{response}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-8">
        {/* Avis général */}
        <Card>
          <CardHeader>
            <CardTitle>Mon avis d'une façon générale</CardTitle>
          </CardHeader>
          <CardContent>
            {renderResponsesList(formatResponses(responses.general))}
          </CardContent>
        </Card>

        {/* Maintien en vie */}
        <Card>
          <CardHeader>
            <CardTitle>Maintien en vie</CardTitle>
          </CardHeader>
          <CardContent>
            {renderResponsesList(formatResponses(responses.lifeSupport))}
          </CardContent>
        </Card>

        {/* Maladie avancée */}
        <Card>
          <CardHeader>
            <CardTitle>Maladie avancée</CardTitle>
          </CardHeader>
          <CardContent>
            {renderResponsesList(formatResponses(responses.advancedIllness))}
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle>Mes goûts et mes peurs</CardTitle>
          </CardHeader>
          <CardContent>
            {renderResponsesList(formatResponses(responses.preferences))}
          </CardContent>
        </Card>

        {/* Synthèse */}
        {responses.synthesis && (
          <Card>
            <CardHeader>
              <CardTitle>Synthèse et expression libre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">
                {responses.synthesis.free_text || "Aucune synthèse saisie"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}