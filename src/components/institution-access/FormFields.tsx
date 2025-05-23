
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form";

interface FormFieldsProps {
  form: {
    lastName: string;
    firstName: string;
    birthDate: string;
    institutionCode: string;
  };
  validationErrors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormFields = ({ form, validationErrors, onChange }: FormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom de famille du patient</Label>
        <Input
          id="lastName"
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          placeholder="NOM"
          className={validationErrors.lastName ? "border-red-500" : ""}
        />
        {validationErrors.lastName && (
          <p className="text-sm text-red-500">{validationErrors.lastName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom du patient</Label>
        <Input
          id="firstName"
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          placeholder="Prénom"
          className={validationErrors.firstName ? "border-red-500" : ""}
        />
        {validationErrors.firstName && (
          <p className="text-sm text-red-500">{validationErrors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Date de naissance</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={onChange}
          className={validationErrors.birthDate ? "border-red-500" : ""}
        />
        {validationErrors.birthDate && (
          <p className="text-sm text-red-500">{validationErrors.birthDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="institutionCode">Code d'accès institution</Label>
        <Input
          id="institutionCode"
          name="institutionCode"
          value={form.institutionCode}
          onChange={onChange}
          placeholder="Code d'accès"
          className={validationErrors.institutionCode ? "border-red-500" : ""}
        />
        {validationErrors.institutionCode && (
          <p className="text-sm text-red-500">{validationErrors.institutionCode}</p>
        )}
      </div>
    </>
  );
};
