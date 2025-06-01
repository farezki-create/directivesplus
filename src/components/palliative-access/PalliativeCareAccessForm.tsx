
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Heart, Shield } from "lucide-react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";
import { validateProfessionalId } from "@/utils/professional-id-validation";

export const PalliativeCareAccessForm: React.FC = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    palliativeCareCode: "",
    professionalId: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Utiliser le hook d'accès institution avec le code palliatif
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.palliativeCareCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    submitted ? formData.professionalId : null,
    Boolean(submitted && formData.lastName && formData.firstName && formData.birthDate && formData.palliativeCareCode && formData.professionalId)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changement dans le champ ${name}:`, value);
    
    // Pour le champ professionalId, ne garder que les chiffres
    if (name === 'professionalId') {
      const numericValue = value.replace(/[^0-9]/g, '');
      console.log(`Valeur numérique filtrée pour ${name}:`, numericValue);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (institutionAccess.error && submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le numéro professionnel avant soumission
    const professionalIdValidation = validateProfessionalId(formData.professionalId);
    if (!professionalIdValidation.isValid) {
      console.error("Numéro professionnel invalide:", professionalIdValidation.error);
      return;
    }
    
    console.log("Soumission du formulaire d'accès palliatif avec les données:", formData);
    setSubmitted(true);
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.palliativeCareCode && formData.professionalId && validateProfessionalId(formData.professionalId).isValid;
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
            </strong>{" "}
            via le dossier de soins palliatifs
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={() => window.location.href = "/mes-directives"}
            className="w-full bg-pink-600 hover:bg-pink-700"
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
      <Alert className="bg-pink-50 border-pink-200">
        <Heart className="h-5 w-5 text-pink-600" />
        <AlertDescription className="text-pink-800">
          <strong>Accès sécurisé au dossier de soins palliatifs</strong><br />
          Le code d'accès palliatif permet de consulter les directives anticipées du patient dans le cadre de son suivi palliatif.
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
            value={formData.professionalId}
            onChange={handleChange}
            placeholder="Saisissez uniquement des chiffres"
            required
            disabled={isLoading}
            maxLength={11}
            autoComplete="off"
          />
          <p className="text-xs text-gray-500">
            RPPS: 11 chiffres | ADELI/FINESS: 9 chiffres (exemple: 12345678901)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="palliativeCareCode">Code d'accès suivi palliatif</Label>
          <Input
            id="palliativeCareCode"
            name="palliativeCareCode"
            type="text"
            value={formData.palliativeCareCode}
            onChange={handleChange}
            placeholder="Code généré par le patient pour le suivi palliatif"
            required
            disabled={isLoading}
            autoComplete="off"
          />
          <p className="text-xs text-pink-600">
            Ce code donne accès aux directives anticipées dans le cadre du suivi palliatif
          </p>
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
          className="w-full bg-pink-600 hover:bg-pink-700"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Accéder aux directives via le suivi palliatif"
          )}
        </Button>
      </form>
    </div>
  );
};
