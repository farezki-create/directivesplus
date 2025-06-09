
import React from "react";
import { useNavigate } from "react-router-dom";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import DirectivesSummary from "@/components/questionnaire/DirectivesSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

const RecapitulatifDirectives = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/signature");
  };

  const handleBack = () => {
    navigate("/texte-libre");
  };

  return (
    <QuestionnaireLayout
      title="Récapitulatif de vos directives"
      description="Vérifiez vos réponses et modifiez-les si nécessaire avant de finaliser vos directives anticipées."
      currentStep={8}
      totalSteps={8}
    >
      <div className="space-y-8">
        <DirectivesSummary />

        <div className="flex justify-between pt-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </Button>
          <Button onClick={handleNext}>
            <FileText size={16} className="mr-2" />
            Signer et finaliser
          </Button>
        </div>
      </div>
    </QuestionnaireLayout>
  );
};

export default RecapitulatifDirectives;
