
import React from "react";
import { useNavigate } from "react-router-dom";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import SignatureCanvas from "@/components/questionnaire/SignatureCanvas";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

const SignatureDirectives = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate("/mes-directives");
  };

  const handleBack = () => {
    navigate("/recapitulatif");
  };

  return (
    <QuestionnaireLayout
      title="Signature de vos directives"
      description="Signez vos directives anticipées pour les rendre officielles."
      currentStep={8}
      totalSteps={8}
    >
      <div className="space-y-8">
        <SignatureCanvas />

        <div className="flex justify-between pt-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Sauvegarder les directives
          </Button>
        </div>
      </div>
    </QuestionnaireLayout>
  );
};

export default SignatureDirectives;
