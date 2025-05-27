
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { validateProfessionalId, formatProfessionalId, type ProfessionalIdValidationResult } from "@/utils/professional-id-validation";

interface InstitutionFormProps {
  formData: {
    lastName: string;
    firstName: string;
    birthDate: string;
    institutionCode: string;
    professionalId: string;
  };
  isFormValid: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InstitutionForm: React.FC<InstitutionFormProps> = ({
  formData,
  isFormValid,
  isLoading,
  error,
  onSubmit,
  onChange
}) => {
  const [professionalIdValidation, setProfessionalIdValidation] = useState<ProfessionalIdValidationResult>({
    isValid: false,
    type: null,
    formattedNumber: ''
  });

  const handleProfessionalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateProfessionalId(value);
    setProfessionalIdValidation(validation);
    
    // Mettre à jour le formData avec le numéro nettoyé
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: validation.formattedNumber
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom de famille du patient</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          placeholder="NOM"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom du patient</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="Prénom"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Date de naissance du patient</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={onChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalId">
          Numéro d'identification professionnel *
          <span className="text-sm text-gray-500 block mt-1">
            RPPS (11 chiffres), ADELI ou FINESS (9 chiffres)
          </span>
        </Label>
        <Input
          id="professionalId"
          name="professionalId"
          value={formData.professionalId}
          onChange={handleProfessionalIdChange}
          placeholder="Ex: 10001234567 (RPPS) ou 123456789 (ADELI/FINESS)"
          required
          disabled={isLoading}
          className={professionalIdValidation.error ? "border-red-500" : 
                    professionalIdValidation.isValid ? "border-green-500" : ""}
        />
        
        {professionalIdValidation.isValid && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>
              Numéro {professionalIdValidation.type} valide: {professionalIdValidation.formattedNumber}
            </span>
          </div>
        )}
        
        {professionalIdValidation.error && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {professionalIdValidation.error}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="institutionCode">Code d'accès institution</Label>
        <Input
          id="institutionCode"
          name="institutionCode"
          value={formData.institutionCode}
          onChange={onChange}
          placeholder="Code fourni par le patient"
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Accès sécurisé et tracé</p>
            <p>Votre identification professionnel et cet accès seront enregistrés dans les logs de sécurité conformément aux exigences HDS.</p>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!isFormValid || !professionalIdValidation.isValid || isLoading}
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
  );
};
