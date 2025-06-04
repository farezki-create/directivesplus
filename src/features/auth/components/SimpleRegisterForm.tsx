
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormValues } from "../schemas";
import { FormLayout } from "./FormLayout";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { PasswordFields } from "./PasswordFields";
import { FormSubmitButton } from "./FormSubmitButton";
import { useSimpleRegister } from "../hooks/useSimpleRegister";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail } from "lucide-react";

interface SimpleRegisterFormProps {
  onSuccess?: () => void;
}

export const SimpleRegisterForm = ({ onSuccess }: SimpleRegisterFormProps) => {
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    show: boolean;
    message: string;
    needsEmailConfirmation: boolean;
  }>({ show: false, message: "", needsEmailConfirmation: false });

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

  const { register, isLoading } = useSimpleRegister();

  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("📝 Soumission formulaire inscription simple");
    
    const result = await register(values);
    
    if (result.success) {
      console.log("✅ Inscription réussie");
      
      form.reset();
      
      setRegistrationSuccess({
        show: true,
        message: result.message,
        needsEmailConfirmation: result.needsEmailConfirmation
      });
      
      if (onSuccess && !result.needsEmailConfirmation) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    }
  };

  if (registrationSuccess.show) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-2">
              <p className="font-medium">Inscription réussie !</p>
              {registrationSuccess.needsEmailConfirmation ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <p>Un email de confirmation a été envoyé à votre adresse.</p>
                  </div>
                  <p className="text-sm font-medium">Cliquez sur le lien dans l'email pour activer votre compte et vous connecter.</p>
                  <p className="text-xs text-green-600">Vérifiez vos spams si nécessaire.</p>
                </div>
              ) : (
                <p>Vous pouvez maintenant vous connecter.</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
        
        <button
          onClick={() => setRegistrationSuccess({ show: false, message: "", needsEmailConfirmation: false })}
          className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Créer un autre compte
        </button>
      </div>
    );
  }

  return (
    <FormLayout form={form} onSubmit={handleSubmit}>
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
