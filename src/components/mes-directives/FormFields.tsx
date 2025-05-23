
import React from "react";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "./DatePickerField";

interface FormFieldsProps {
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  birthdate: Date | undefined;
  setBirthdate: (birthdate: Date | undefined) => void;
  accessCode: string;
  setAccessCode: (accessCode: string) => void;
  loading: boolean;
}

const FormFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthdate,
  setBirthdate,
  accessCode,
  setAccessCode,
  loading
}: FormFieldsProps) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="firstName" className="text-sm font-medium">
          Prénom
        </label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Votre prénom"
          disabled={loading}
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="lastName" className="text-sm font-medium">
          Nom
        </label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Votre nom"
          disabled={loading}
        />
      </div>
      
      <DatePickerField 
        birthdate={birthdate}
        setBirthdate={setBirthdate}
        disabled={loading}
      />
      
      <div className="space-y-1">
        <label htmlFor="accessCode" className="text-sm font-medium">
          Code d'accès
        </label>
        <Input
          id="accessCode"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Code d'accès"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default FormFields;
