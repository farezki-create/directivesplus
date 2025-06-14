
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldsSectionProps {
  formData: {
    lastName: string;
    firstName: string;
    birthDate: string;
    accessCode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: Record<string, string>;
  isLoading: boolean;
}

export const FormFieldsSection: React.FC<FormFieldsSectionProps> = ({
  formData,
  onChange,
  validationErrors,
  isLoading
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom de famille du patient *</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
    </>
  );
};
