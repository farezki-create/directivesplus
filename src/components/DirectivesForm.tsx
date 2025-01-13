import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { PersonalInfoStep } from "./directives/PersonalInfoStep";
import { MedicalDirectivesStep } from "./directives/MedicalDirectivesStep";
import { SpecificWishesStep } from "./directives/SpecificWishesStep";

type CountryKey = keyof typeof COUNTRY_PREFIXES;

const COUNTRY_PREFIXES = {
  "France": "+33",
  "Belgique": "+32",
  "Suisse": "+41",
  "Luxembourg": "+352",
  "Canada": "+1",
  "Monaco": "+377",
} as const;

export const DirectivesForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("France");

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
      <Progress value={progress} className="mb-6" />
      
      {step === 1 && (
        <PersonalInfoStep
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
      )}

      {step === 2 && <MedicalDirectivesStep />}

      {step === 3 && <SpecificWishesStep />}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
        >
          Précédent
        </Button>
        <Button
          onClick={nextStep}
          disabled={step === 3}
        >
          Suivant
        </Button>
      </div>
    </Card>
  );
};