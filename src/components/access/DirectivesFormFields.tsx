
import React from "react";
import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";
import SecurityAlerts from "./SecurityAlerts";
import DatePickerField from "./calendar/DatePickerField";

interface DirectivesFormFieldsProps {
  form: UseFormReturn<any>;
  loading: boolean;
  blockedAccess: boolean;
  errorMessage: string | null;
  remainingAttempts: number | null;
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
}

const DirectivesFormFields: React.FC<DirectivesFormFieldsProps> = ({
  form,
  loading,
  blockedAccess,
  errorMessage,
  remainingAttempts,
  calendarDate,
  setCalendarDate,
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
      
      <DatePickerField 
        control={form.control}
        loading={loading || blockedAccess}
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
      />
      
      <FormField 
        id="accessCode"
        label="Code d'accès aux directives anticipées"
        placeholder="Code d'accès unique aux directives"
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
