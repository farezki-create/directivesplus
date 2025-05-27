
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";

export const InstitutionAccessForm: React.FC = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    accessCode: "",
    professionalId: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Utiliser le hook d'accès institution avec le nouveau paramètre professionalId
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.accessCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    submitted ? formData.professionalId : null,
    Boolean(submitted && formData.lastName && formData.firstName && formData.birthDate && formData.accessCode && formData.professionalId)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changement dans le champ ${name}:`, value);
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (institutionAccess.error && submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire avec les données:", formData);
    setSubmitted(true);
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.accessCode && formData.professionalId;
  const isLoading = submitted && institutionAccess.loading;

  // Si l'accès est accordé, afficher le message de succès
  if (institutionAccess.accessGranted) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Accès autorisé</strong><br />
            Vous avez maintenant accès aux directives anticipées de{" "}
            <strong>
              {institutionAccess.patientData?.first_name} {institutionAccess.patientData?.last_name}
            </strong>
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={() => window.location.href = "/mes-directives"}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            Consulter les directives maintenant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Accès sécurisé aux directives anticipées avec vérification d'identité complète.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom de famille du patient</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="NOM"
            required
            disabled={isLoading}
            autoComplete="family-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom du patient</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Prénom"
            required
            disabled={isLoading}
            autoComplete="given-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="bday"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="professionalId">Numéro d'identification professionnel</Label>
          <Input
            id="professionalId"
            name="professionalId"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.professionalId}
            onChange={handleChange}
            placeholder="RPPS, ADELI ou FINESS (chiffres uniquement)"
            required
            disabled={isLoading}
            autoComplete="off"
            maxLength={11}
          />
          <p className="text-xs text-gray-500">
            RPPS: 11 chiffres | ADELI/FINESS: 9 chiffres
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessCode">Code d'accès partagé</Label>
          <Input
            id="accessCode"
            name="accessCode"
            type="text"
            value={formData.accessCode}
            onChange={handleChange}
            placeholder="Code généré par le patient"
            required
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        {institutionAccess.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {institutionAccess.error}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Accéder aux directives"
          )}
        </Button>
      </form>
    </div>
  );
};
