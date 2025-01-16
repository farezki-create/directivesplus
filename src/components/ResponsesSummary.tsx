import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
      <div className="text-center p-8 text-destructive">
        Une erreur est survenue lors de la récupération de vos réponses.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-8">
        {/* Avis général */}
        <Card>
          <CardHeader>
            <CardTitle>Mon avis d'une façon générale</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {responses.general?.map((response: any) => (
                <li key={response.id} className="border-b pb-2">
                  <p className="font-medium">{response.questions.Question}</p>
                  <p className="text-muted-foreground">{response.response}</p>
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
            <ul className="space-y-2">
              {responses.lifeSupport?.map((response: any) => (
                <li key={response.id} className="border-b pb-2">
                  <p className="font-medium">{response.life_support_questions.question}</p>
                  <p className="text-muted-foreground">{response.response}</p>
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
            <ul className="space-y-2">
              {responses.advancedIllness?.map((response: any) => (
                <li key={response.id} className="border-b pb-2">
                  <p className="font-medium">{response.advanced_illness_questions.question}</p>
                  <p className="text-muted-foreground">{response.response}</p>
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
            <ul className="space-y-2">
              {responses.preferences?.map((response: any) => (
                <li key={response.id} className="border-b pb-2">
                  <p className="font-medium">{response.preferences_questions.question}</p>
                  <p className="text-muted-foreground">{response.response}</p>
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
              <p className="whitespace-pre-wrap">{responses.synthesis.free_text}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}