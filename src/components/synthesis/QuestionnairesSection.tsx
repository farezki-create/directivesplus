
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const QUESTIONNAIRE_LABELS = {
  'avis-general': 'Avis Général',
  'maintien-vie': 'Maintien en Vie',
  'maladie-avancee': 'Maladie Avancée',
  'gouts-peurs': 'Goûts et Peurs'
};

interface QuestionnairesSectionProps {
  responses: Record<string, any>;
}

const QuestionnairesSection = ({ responses }: QuestionnairesSectionProps) => {
  const hasResponses = Object.keys(responses).some(key => 
    responses[key] && Object.keys(responses[key]).length > 0
  );
  
  if (!hasResponses) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Réponses aux questionnaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(responses).map(([type, typeResponses]) => {
            // Skip if no responses for this type
            if (!typeResponses || Object.keys(typeResponses).length === 0) return null;
            
            return (
              <div key={type} className="space-y-2">
                <h3 className="text-lg font-medium">{QUESTIONNAIRE_LABELS[type as keyof typeof QUESTIONNAIRE_LABELS] || type}</h3>
                
                <div className="pl-4">
                  {Object.entries(typeResponses).map(([questionId, data]) => {
                    const { question, response } = data as { question: string, response: string };
                    
                    return (
                      <div key={questionId} className="mb-2">
                        <p className="font-medium text-sm">{question}</p>
                        <p className="text-gray-700">{response}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnairesSection;
