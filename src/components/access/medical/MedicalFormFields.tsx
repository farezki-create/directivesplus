
import React from "react";
import { UseFormReturn } from "react-hook-form";
import FormField from "../FormField";
import SecurityAlerts from "../SecurityAlerts";

interface MedicalFormFieldsProps {
  form: UseFormReturn<any>;
  loading: boolean;
  blockedAccess: boolean;
  errorMessage: string | null;
  remainingAttempts: number | null;
}

const MedicalFormFields: React.FC<MedicalFormFieldsProps> = ({
  form,
  loading,
  blockedAccess,
  errorMessage,
  remainingAttempts,
}) => {
  return (
    <div className="space-y-4">
      <FormField 
        id="lastName"
        label="Nom"
        placeholder="Nom de famille"
        control={form.control}
        disabled={loading || blockedAccess}
      />
      
      <FormField 
        id="firstName"
        label="Prénom"
        placeholder="Prénom"
        control={form.control}
        disabled={loading || blockedAccess}
      />
      
      <FormField 
        id="birthDate"
        label="Date de naissance"
        type="date"
        control={form.control}
        disabled={loading || blockedAccess}
      />
      
      <FormField 
        id="accessCode"
        label="Code d'accès aux données médicales"
        placeholder="Code d'accès unique aux données médicales"
        control={form.control}
        disabled={loading || blockedAccess}
      />

      <SecurityAlerts 
        errorMessage={errorMessage}
        remainingAttempts={remainingAttempts}
        blockedAccess={blockedAccess}
      />
    </div>
  );
};

export default MedicalFormFields;
