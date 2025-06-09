
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDirectivesStore } from "@/store/directivesStore";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import ExamplePhrasesSelection from "@/components/questionnaire/ExamplePhrasesSelection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ExemplesPhrasesPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/texte-libre");
  };

  const handleBack = () => {
    navigate("/personnes-confiance");
  };

  return (
    <QuestionnaireLayout
      title="Phrases d'exemple"
      description="Sélectionnez les phrases qui correspondent à vos souhaits ou inspirez-vous en pour rédiger vos propres directives."
      currentStep={7}
      totalSteps={8}
    >
      <div className="space-y-8">
        <ExamplePhrasesSelection />

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

export default ExemplesPhrasesPage;
