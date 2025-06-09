
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDirectivesStore } from "@/store/directivesStore";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import MultipleChoiceQuestion from "@/components/questionnaire/MultipleChoiceQuestion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TraitementsAgressifs = () => {
  const navigate = useNavigate();
  const { responses, updateResponse } = useDirectivesStore();

  const questions = [
    {
      id: "aggressive_treatments",
      question: "Souhaitez-vous recevoir des traitements agressifs si votre état de santé se dégrade gravement ?",
      options: [
        { value: "yes", label: "Oui, je souhaite tous les traitements possibles" },
        { value: "no", label: "Non, je préfère des soins de confort" },
        { value: "unsure", label: "Je ne suis pas certain(e)" }
      ]
    },
    {
      id: "intensive_care",
      question: "Accepteriez-vous d'être admis(e) en soins intensifs ?",
      options: [
        { value: "yes", label: "Oui" },
        { value: "no", label: "Non" },
        { value: "unsure", label: "Je ne suis pas certain(e)" }
      ]
    }
  ];

  const handleNext = () => {
    navigate("/comfort-care");
  };

  const handleBack = () => {
    navigate("/maintien-vie");
  };

  return (
    <QuestionnaireLayout
      title="Traitements agressifs"
      description="Ces questions concernent votre position sur les traitements intensifs et agressifs."
      currentStep={3}
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

export default TraitementsAgressifs;
