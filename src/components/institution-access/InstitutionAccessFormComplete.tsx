
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";
import { validateInstitutionAccessForm } from "@/hooks/access/institution/useInstitutionAccessValidation";

export const InstitutionAccessFormComplete: React.FC = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    accessCode: "",
    professionalId: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Use institution access hook
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.accessCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    submitted ? formData.professionalId : null,
    Boolean(submitted && formData.lastName && formData.firstName && formData.birthDate && formData.accessCode)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Form field change - ${name}:`, value);
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Special handling for professional ID (numbers only)
    if (name === 'professionalId') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Reset submission state if there was an error
    if (institutionAccess.error && submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission attempt:", formData);
    
    // Validate form
    const errors = validateInstitutionAccessForm(formData);
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      setValidationErrors(errors);
      return;
    }
    
    console.log("Form validation passed, submitting...");
    setValidationErrors({});
    setSubmitted(true);
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.accessCode;
  const isLoading = submitted && institutionAccess.loading;

  // Success state
  if (institutionAccess.accessGranted) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
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
          <strong>Accès sécurisé aux directives anticipées</strong><br />
          Remplissez tous les champs requis pour accéder aux directives du patient.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom de famille du patient *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="NOM"
            required
            disabled={isLoading}
            autoComplete="family-name"
            className={validationErrors.lastName ? "border-red-500" : ""}
          />
          {validationErrors.lastName && (
            <p className="text-sm text-red-500">{validationErrors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom du patient *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Prénom"
            required
            disabled={isLoading}
            autoComplete="given-name"
            className={validationErrors.firstName ? "border-red-500" : ""}
          />
          {validationErrors.firstName && (
            <p className="text-sm text-red-500">{validationErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance *</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="bday"
            className={validationErrors.birthDate ? "border-red-500" : ""}
          />
          {validationErrors.birthDate && (
            <p className="text-sm text-red-500">{validationErrors.birthDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessCode">Code d'accès partagé *</Label>
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
            className={validationErrors.accessCode ? "border-red-500" : ""}
          />
          {validationErrors.accessCode && (
            <p className="text-sm text-red-500">{validationErrors.accessCode}</p>
          )}
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

      <div className="text-xs text-gray-500 text-center">
        * Champs obligatoires
      </div>
    </div>
  );
};
