import { useState } from "react";
import { Card } from "./ui/card";
import { FormProgress } from "./directives/FormProgress";
import { PersonalInfoStep } from "./directives/PersonalInfoStep";
import { MedicalDirectivesStep } from "./directives/MedicalDirectivesStep";
import { SpecificWishesStep } from "./directives/SpecificWishesStep";
import { NavigationButtons } from "./directives/NavigationButtons";

export const DirectivesForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("France");

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress((step / 3) * 100);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 2) / 3) * 100);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <FormProgress progress={progress} />
      
      {step === 1 && (
        <PersonalInfoStep
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
      )}

      {step === 2 && <MedicalDirectivesStep />}

      {step === 3 && <SpecificWishesStep />}

      <NavigationButtons
        step={step}
        onPrevious={prevStep}
        onNext={nextStep}
      />
    </Card>
  );
};