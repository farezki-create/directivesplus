
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDirectivesStore } from "@/store/directivesStore";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import MultipleChoiceQuestion from "@/components/questionnaire/MultipleChoiceQuestion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ComfortCare = () => {
  const navigate = useNavigate();
  const { responses, updateResponse } = useDirectivesStore();

  const questions = [
    {
      id: "comfort_care",
      question: "Privilégiez-vous les soins de confort par rapport aux traitements curatifs ?",
      options: [
        { value: "yes", label: "Oui, le confort est ma priorité" },
        { value: "no", label: "Non, je préfère les traitements curatifs" },
        { value: "unsure", label: "Cela dépend de la situation" }
      ]
    },
    {
      id: "pain_management",
      question: "Acceptez-vous tous les traitements nécessaires pour soulager la douleur, même s'ils peuvent raccourcir votre vie ?",
      options: [
        { value: "yes", label: "Oui, éliminer la douleur est prioritaire" },
        { value: "no", label: "Non, je préfère supporter la douleur" },
        { value: "unsure", label: "Je ne suis pas certain(e)" }
      ]
    }
  ];

  const handleNext = () => {
    navigate("/qualite-vie");
  };

  const handleBack = () => {
    navigate("/traitements-agressifs");
  };

  return (
    <QuestionnaireLayout
      title="Soins de confort"
      description="Ces questions concernent votre approche des soins palliatifs et du confort."
      currentStep={4}
      totalSteps={8}
    >
      <div className="space-y-8">
        {questions.map((question) => (
          <MultipleChoiceQuestion
            key={question.id}
            question={question.question}
            options={question.options}
            value={responses[question.id]}
            onChange={(value) => updateResponse(question.id, value)}
          />
        ))}

        <div className="flex justify-between pt-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Précédent
          </Button>
          <Button onClick={handleNext}>
            Suivant
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </QuestionnaireLayout>
  );
};

export default ComfortCare;
