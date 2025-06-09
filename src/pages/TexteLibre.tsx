
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDirectivesStore } from "@/store/directivesStore";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import FreeTextEditor from "@/components/questionnaire/FreeTextEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TexteLibre = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/recapitulatif");
  };

  const handleBack = () => {
    navigate("/exemples-phrases");
  };

  return (
    <QuestionnaireLayout
      title="Texte libre"
      description="Ajoutez vos propres instructions et souhaits concernant vos soins médicaux."
      currentStep={8}
      totalSteps={8}
    >
      <div className="space-y-8">
        <FreeTextEditor />

        <div className="flex justify-between pt-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Précédent
          </Button>
          <Button onClick={handleNext}>
            Terminer le questionnaire
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </QuestionnaireLayout>
  );
};

export default TexteLibre;
