import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Définition des préfixes téléphoniques par pays
const COUNTRY_PREFIXES = {
  "France": "+33",
  "Belgique": "+32",
  "Suisse": "+41",
  "Luxembourg": "+352",
  "Canada": "+1",
  "Monaco": "+377",
} as const;

type CountryKey = keyof typeof COUNTRY_PREFIXES;

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
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="w-32"
        >
          Précédent
        </Button>
        <Button
          onClick={nextStep}
          disabled={step === 3}
          className="w-32"
        >
          Suivant
        </Button>
      </div>

      <Progress value={progress} className="mb-6" />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Informations personnelles</h2>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Genre</Label>
            <Select>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Sélectionnez votre genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Homme</SelectItem>
                <SelectItem value="female">Femme</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" placeholder="Votre prénom" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" placeholder="Votre nom" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthdate">Date de naissance</Label>
            <Input id="birthdate" type="date" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adresse</h3>
            
            <div className="space-y-2">
              <Label htmlFor="street">Rue</Label>
              <Textarea 
                id="street" 
                placeholder="Numéro et nom de rue"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input 
                  id="postalCode" 
                  placeholder="Code postal"
                  pattern="[0-9]{5}"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" placeholder="Ville" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select 
                value={selectedCountry}
                onValueChange={(value) => setSelectedCountry(value as CountryKey)}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(COUNTRY_PREFIXES).map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <div className="flex gap-2">
              <Select defaultValue={COUNTRY_PREFIXES[selectedCountry]} disabled>
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{COUNTRY_PREFIXES[selectedCountry]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={COUNTRY_PREFIXES[selectedCountry]}>
                    {COUNTRY_PREFIXES[selectedCountry]}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="Votre numéro de téléphone"
                pattern="[0-9]{9}"
                className="flex-1"
              />
            </div>
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
    </Card>
  );
};
