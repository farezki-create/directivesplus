
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormValues } from "./schemas";
import { FormLayout } from "./components/FormLayout";
import { PersonalInfoFields } from "./components/PersonalInfoFields";
import { ContactInfoFields } from "./components/ContactInfoFields";
import { PasswordFields } from "./components/PasswordFields";
import { FormSubmitButton } from "./components/FormSubmitButton";
import { useRegister } from "./hooks/useRegister";

interface RegisterFormProps {
  onVerificationSent: (email: string) => void;
}

export const RegisterForm = ({ onVerificationSent }: RegisterFormProps) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      birthDate: "",
      email: "",
      address: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { register, isLoading } = useRegister();

  return (
    <FormLayout form={form} onSubmit={register}>
      <PersonalInfoFields form={form} />
      <ContactInfoFields form={form} />
      <PasswordFields form={form} />
      <FormSubmitButton 
        loading={isLoading} 
        label="S'inscrire" 
        loadingLabel="Inscription..." 
      />
    </FormLayout>
  );
};
