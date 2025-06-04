
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../schemas";
import { FormLayout } from "./FormLayout";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { PasswordFields } from "./PasswordFields";
import { FormSubmitButton } from "./FormSubmitButton";

interface RegistrationFormViewProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
}

export const RegistrationFormView = ({ form, onSubmit, isLoading }: RegistrationFormViewProps) => {
  return (
    <FormLayout form={form} onSubmit={onSubmit}>
      <PersonalInfoFields form={form} />
      <ContactInfoFields form={form} />
      <PasswordFields form={form} />
      <FormSubmitButton 
        loading={isLoading} 
        label="S'inscrire" 
        loadingLabel="Inscription en cours..." 
      />
    </FormLayout>
  );
};
