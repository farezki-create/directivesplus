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
import { EmailConfirmationPrompt } from "@/components/auth/EmailConfirmationPrompt";
import { useNavigate } from "react-router-dom";

interface SimpleRegisterFormProps {
  onSuccess?: () => void;
}

export const SimpleRegisterForm = ({ onSuccess }: SimpleRegisterFormProps) => {
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    show: boolean;
    message: string;
    needsEmailConfirmation: boolean;
    userEmail?: string;
  }>({ show: false, message: "", needsEmailConfirmation: false });
  
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const navigate = useNavigate();

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
        needsEmailConfirmation: result.needsEmailConfirmation,
        userEmail: values.email
      });
      
      if (onSuccess && !result.needsEmailConfirmation) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    }
  };

  const handleRequestOTPCode = async () => {
    if (!registrationSuccess.userEmail) return;
    
    setIsRequestingOTP(true);
    
    try {
      console.log('📧 Demande de code OTP pour:', registrationSuccess.userEmail);
      
      const response = await fetch('https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc`
        },
        body: JSON.stringify({ email: registrationSuccess.userEmail }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Rediriger vers la page OTP avec l'email pré-rempli
        navigate(`/otp-auth?email=${encodeURIComponent(registrationSuccess.userEmail)}`);
      } else {
        console.error('Erreur envoi OTP:', data.error);
      }
    } catch (error) {
      console.error('Erreur demande OTP:', error);
    } finally {
      setIsRequestingOTP(false);
    }
  };

  if (registrationSuccess.show && registrationSuccess.needsEmailConfirmation) {
    return (
      <EmailConfirmationPrompt
        email={registrationSuccess.userEmail || ''}
        onRequestOTPCode={handleRequestOTPCode}
        isLoadingOTP={isRequestingOTP}
      />
    );
  }

  if (registrationSuccess.show && !registrationSuccess.needsEmailConfirmation) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-green-600 font-medium">✅ {registrationSuccess.message}</p>
        </div>
        
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
