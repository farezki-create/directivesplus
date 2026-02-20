
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";
import { validateInstitutionAccessForm } from "@/hooks/access/institution/useInstitutionAccessValidation";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { FormFieldsSection } from "./FormFieldsSection";
import { AccessSuccessView } from "./AccessSuccessView";

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

  const { handleError } = useErrorHandler({ component: 'InstitutionAccessForm' });

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
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name === 'professionalId') {
      const numericValue = value.replace(/[^0-9]/g, '');
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
    const errors = validateInstitutionAccessForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setSubmitted(true);
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.accessCode;
  const isLoading = submitted && institutionAccess.loading;

  if (institutionAccess.accessGranted) {
    return <AccessSuccessView patientData={institutionAccess.patientData} />;
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
        <FormFieldsSection
          formData={formData}
          onChange={handleChange}
          validationErrors={validationErrors}
          isLoading={isLoading}
        />

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
