import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface ResponsesSummaryProps {
  userId: string;
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

  const formatResponses = (responseArray: any[]) => {
    if (!responseArray || responseArray.length === 0) {
      return "Aucune réponse";
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

    return Object.values(groupedResponses).map((group: any) => ({
      question: group.question,
      responses: group.responses
    }));
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
            <ul className="space-y-4">
              {formatResponses(responses.general).map((item: any, index: number) => (
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
          </CardContent>
        </Card>

        {/* Maintien en vie */}
        <Card>
          <CardHeader>
            <CardTitle>Maintien en vie</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {formatResponses(responses.lifeSupport).map((item: any, index: number) => (
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
          </CardContent>
        </Card>

        {/* Maladie avancée */}
        <Card>
          <CardHeader>
            <CardTitle>Maladie avancée</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {formatResponses(responses.advancedIllness).map((item: any, index: number) => (
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
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle>Mes goûts et mes peurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {formatResponses(responses.preferences).map((item: any, index: number) => (
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