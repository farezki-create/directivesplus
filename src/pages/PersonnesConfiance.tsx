
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDirectivesStore } from "@/store/directivesStore";
import QuestionnaireLayout from "@/components/questionnaire/QuestionnaireLayout";
import TrustedPersonForm from "@/components/questionnaire/TrustedPersonForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const PersonnesConfiance = () => {
  const navigate = useNavigate();
  const { trustedPersons } = useDirectivesStore();

  const handleNext = () => {
    navigate("/exemples-phrases");
  };

  const handleBack = () => {
    navigate("/qualite-vie");
  };

  return (
    <QuestionnaireLayout
      title="Personnes de confiance"
      description="Désignez les personnes qui pourront prendre des décisions médicales en votre nom."
      currentStep={6}
      totalSteps={8}
    >
      <div className="space-y-8">
        <TrustedPersonForm />

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

export default PersonnesConfiance;
