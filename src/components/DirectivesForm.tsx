import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";

export const DirectivesForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

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
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Informations personnelles</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" placeholder="Votre nom complet" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Date de naissance</Label>
            <Input id="birthdate" type="date" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Directives médicales</h2>
          <div className="space-y-2">
            <Label htmlFor="medical">Vos souhaits concernant les soins médicaux</Label>
            <Textarea 
              id="medical" 
              placeholder="Décrivez vos souhaits concernant les traitements médicaux..."
              className="min-h-[200px]"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Souhaits particuliers</h2>
          <div className="space-y-2">
            <Label htmlFor="specific">Précisions supplémentaires</Label>
            <Textarea 
              id="specific" 
              placeholder="Ajoutez des précisions sur vos souhaits..."
              className="min-h-[200px]"
            />
          </div>
        </div>
      )}

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