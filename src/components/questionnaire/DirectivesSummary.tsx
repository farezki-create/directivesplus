
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDirectivesStore } from "@/store/directivesStore";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const DirectivesSummary = () => {
  const { responses, trustedPersons } = useDirectivesStore();

  const getResponseLabel = (value: string) => {
    switch (value) {
      case "yes": return "Oui";
      case "no": return "Non";
      case "unsure": return "Je ne suis pas certain(e)";
      case "quality": return "La qualité de vie est plus importante";
      case "duration": return "La durée de vie est plus importante";
      case "balanced": return "Les deux sont également importantes";
      case "depends": return "Cela dépend du degré de perte d'autonomie";
      default: return value;
    }
  };

  const questionLabels: Record<string, string> = {
    aggressive_treatments: "Traitements agressifs",
    intensive_care: "Soins intensifs",
    comfort_care: "Soins de confort",
    pain_management: "Gestion de la douleur",
    quality_of_life: "Qualité vs durée de vie",
    autonomy: "Perte d'autonomie"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vos réponses au questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(responses).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(responses).map(([questionId, response]) => (
                <div key={questionId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">
                    {questionLabels[questionId] || questionId}
                  </span>
                  <span className="text-gray-600">
                    {getResponseLabel(response)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune réponse enregistrée</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personnes de confiance</CardTitle>
        </CardHeader>
        <CardContent>
          {trustedPersons.length > 0 ? (
            <div className="space-y-3">
              {trustedPersons.map((person) => (
                <div key={person.id} className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium">{person.firstName} {person.lastName}</h4>
                  <p className="text-sm text-gray-600">{person.relationship}</p>
                  <p className="text-sm text-gray-600">{person.phone}</p>
                  {person.email && <p className="text-sm text-gray-600">{person.email}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune personne de confiance ajoutée</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" className="mr-4">
          <Edit className="w-4 h-4 mr-2" />
          Modifier mes réponses
        </Button>
      </div>
    </div>
  );
};

export default DirectivesSummary;
