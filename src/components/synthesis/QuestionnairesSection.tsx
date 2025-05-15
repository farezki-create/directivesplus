
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Fonction pour traduire les réponses anglaises en français
const translateResponse = (response: string): string => {
  if (!response) return 'Pas de réponse';
  
  const lowerResponse = response.toLowerCase().trim();
  
  switch (lowerResponse) {
    case 'yes':
      return 'Oui';
    case 'no':
      return 'Non';
    case 'unsure':
      return 'Incertain';
    default:
      return response;
  }
};

const QuestionnairesSection = ({ 
  responses 
}: { 
  responses: Record<string, any>
}) => {
  // Fonction pour obtenir le titre français du questionnaire
  const getQuestionnaireTitle = (type: string) => {
    switch (type) {
      case 'avis-general':
        return "Avis Général";
      case 'maintien-vie':
        return "Maintien en Vie";
      case 'maladie-avancee':
        return "Maladie Avancée";
      case 'gouts-peurs':
        return "Goûts et Peurs";
      default:
        return type;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Vos Réponses aux Questionnaires</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(responses).length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(responses).map(([questionnaireType, questions], index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {getQuestionnaireTitle(questionnaireType)}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    {Object.entries(questions).map(([questionId, questionData]: [string, any]) => (
                      <div key={questionId} className="p-4 bg-gray-50 rounded-md">
                        <p className="font-medium mb-2">{questionData.question}</p>
                        <p className="text-gray-700">
                          <span className="font-medium">Réponse:</span> {translateResponse(questionData.response || "Pas de réponse")}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-gray-500 my-4">Aucune réponse enregistrée</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionnairesSection;
