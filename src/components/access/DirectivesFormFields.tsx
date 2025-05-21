
import React from "react";
import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";
import SecurityAlerts from "./SecurityAlerts";

interface DirectivesFormFieldsProps {
  form: UseFormReturn<any>;
  loading: boolean;
  blockedAccess: boolean;
  errorMessage: string | null;
  remainingAttempts: number | null;
}

const DirectivesFormFields: React.FC<DirectivesFormFieldsProps> = ({
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
        label="Code d'accès"
        placeholder="Code d'accès unique"
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

export default DirectivesFormFields;
