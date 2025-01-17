import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <Alert variant="destructive" className="m-8">
        <AlertDescription>
          Une erreur est survenue lors de la récupération de vos réponses.
        </AlertDescription>
      </Alert>
    );
  }

  const hasNoResponses = 
    (!responses.general || responses.general.length === 0) &&
    (!responses.lifeSupport || responses.lifeSupport.length === 0) &&
    (!responses.advancedIllness || responses.advancedIllness.length === 0) &&
    (!responses.preferences || responses.preferences.length === 0) &&
    !responses.synthesis?.free_text;

  if (hasNoResponses) {
    return (
      <Alert className="m-8">
        <AlertDescription>
          Vous n'avez pas encore répondu aux questionnaires.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-8">
        {responses.general && responses.general.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mon avis d'une façon générale</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {responses.general.map((response) => (
                  <li key={response.id} className="border-b pb-2">
                    <p className="font-medium">{response.questions.Question}</p>
                    <p className="text-muted-foreground">{response.response}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {responses.lifeSupport && responses.lifeSupport.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Maintien en vie</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {responses.lifeSupport.map((response) => (
                  <li key={response.id} className="border-b pb-2">
                    <p className="font-medium">{response.life_support_questions.question}</p>
                    <p className="text-muted-foreground">{response.response}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {responses.advancedIllness && responses.advancedIllness.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Maladie avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {/* Group responses by question */}
                {Object.entries(
                  responses.advancedIllness.reduce((acc, response) => {
                    const questionId = response.question_id;
                    if (!acc[questionId]) {
                      acc[questionId] = {
                        question: response.advanced_illness_questions.question,
                        responses: []
                      };
                    }
                    acc[questionId].responses.push(response.response);
                    return acc;
                  }, {} as Record<string, { question: string; responses: string[] }>)
                ).map(([questionId, { question, responses }]) => (
                  <li key={questionId} className="border-b pb-2">
                    <p className="font-medium">{question}</p>
                    <ul className="list-disc list-inside">
                      {responses.map((response, index) => (
                        <li key={index} className="text-muted-foreground ml-4">
                          {response}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {responses.preferences && responses.preferences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mes goûts et mes peurs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {responses.preferences.map((response) => (
                  <li key={response.id} className="border-b pb-2">
                    <p className="font-medium">{response.preferences_questions.question}</p>
                    <p className="text-muted-foreground">{response.response}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {responses.synthesis?.free_text && (
          <Card>
            <CardHeader>
              <CardTitle>Synthèse et expression libre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{responses.synthesis.free_text}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}