
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDirectivesStore } from "@/store/directivesStore";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import MultipleChoiceQuestion from "@/components/questionnaire/MultipleChoiceQuestion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QualiteVie = () => {
  const navigate = useNavigate();
  const { responses, updateResponse } = useDirectivesStore();

  const questions = [
    {
      id: "quality_of_life",
      question: "Quelle importance accordez-vous à la qualité de vie par rapport à la durée de vie ?",
      options: [
        { value: "quality", label: "La qualité de vie est plus importante" },
        { value: "duration", label: "La durée de vie est plus importante" },
        { value: "balanced", label: "Les deux sont également importantes" }
      ]
    },
    {
      id: "autonomy",
      question: "Si vous perdiez votre autonomie physique ou mentale, souhaiteriez-vous poursuivre les traitements ?",
      options: [
        { value: "yes", label: "Oui, continuer les traitements" },
        { value: "no", label: "Non, arrêter les traitements" },
        { value: "depends", label: "Cela dépend du degré de perte d'autonomie" }
      ]
    }
  ];

  const handleNext = () => {
    navigate("/personnes-confiance");
  };

  const handleBack = () => {
    navigate("/comfort-care");
  };

  return (
    <QuestionnaireLayout
      title="Qualité de vie"
      description="Ces questions concernent vos priorités en matière de qualité de vie."
      currentStep={5}
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

export default QualiteVie;
