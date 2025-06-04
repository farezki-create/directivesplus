
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormValues } from "./schemas";
import { ConfirmationCodeInput } from "./components/ConfirmationCodeInput";
import { RegistrationSuccessView } from "./components/RegistrationSuccessView";
import { RegistrationFormView } from "./components/RegistrationFormView";
import { useRegistrationState } from "./hooks/useRegistrationState";
import { useRegistrationFlow } from "./hooks/useRegistrationFlow";

interface RegisterFormWithConfirmationProps {
  onSuccess?: () => void;
}

export const RegisterFormWithConfirmation = ({ onSuccess }: RegisterFormWithConfirmationProps) => {
  const {
    registrationState,
    confirmationError,
    isConfirming,
    updateRegistrationState,
    setConfirmationError,
    setIsConfirming,
    resetConfirmationError
  } = useRegistrationState();

  const {
    handleSubmit,
    handleConfirmCode,
    handleResendCode,
    isLoading
  } = useRegistrationFlow({
    registrationState,
    updateRegistrationState,
    setConfirmationError,
    setIsConfirming,
    resetConfirmationError
  });

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

  if (registrationState.step === 'success') {
    return <RegistrationSuccessView />;
  }

  if (registrationState.step === 'confirmation') {
    return (
      <ConfirmationCodeInput
        email={registrationState.userEmail}
        onConfirm={handleConfirmCode}
        onResend={handleResendCode}
        isLoading={isConfirming}
        error={confirmationError}
      />
    );
  }

  return (
    <RegistrationFormView
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
