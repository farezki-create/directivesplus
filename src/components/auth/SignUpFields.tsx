import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { PasswordConfirmField } from "./signup/PasswordConfirmField";
import { PersonalInfoFields } from "./signup/PersonalInfoFields";
import { AddressFields } from "./signup/AddressFields";
import { ContactFields } from "./signup/ContactFields";

type SignUpFieldsProps = {
  form: UseFormReturn<FormValues>;
};

export const SignUpFields = ({ form }: SignUpFieldsProps) => {
  return (
    <div className="space-y-4">
      <PasswordConfirmField form={form} />
      <PersonalInfoFields form={form} />
      <AddressFields form={form} />
      <ContactFields form={form} />
    </div>
  );
};