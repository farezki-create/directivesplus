
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormValues } from "./schemas";
import { FormLayout } from "./components/FormLayout";
import { PersonalInfoFields } from "./components/PersonalInfoFields";
import { ContactInfoFields } from "./components/ContactInfoFields";
import { PasswordFields } from "./components/PasswordFields";
import { FormSubmitButton } from "./components/FormSubmitButton";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { ConfirmationCodeInput } from "./components/ConfirmationCodeInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEmailConfirmationSignup } from "@/hooks/useEmailConfirmationSignup";
import { useOTPEmailSender } from "@/hooks/useOTPEmailSender";
import { generateOTP } from "@/utils/otpGenerator";

interface RegisterFormWithConfirmationProps {
  onSuccess?: () => void;
}

interface RegistrationState {
  step: 'form' | 'confirmation' | 'success';
  userEmail: string;
  confirmationCode: string;
  firstName: string;
  lastName: string;
  userId?: string;
}

export const RegisterFormWithConfirmation = ({ onSuccess }: RegisterFormWithConfirmationProps) => {
  const [registrationState, setRegistrationState] = useState<RegistrationState>({
    step: 'form',
    userEmail: '',
    confirmationCode: '',
    firstName: '',
    lastName: ''
  });

  const [confirmationError, setConfirmationError] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  
  const navigate = useNavigate();
  const { signUp, isLoading } = useEmailConfirmationSignup();
  const { sendOTP } = useOTPEmailSender();

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

  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("📝 === SOUMISSION FORMULAIRE ===");
    console.log("📧 Email du formulaire:", `"${values.email}"`);
    
    const result = await signUp(values);
    
    if (result.success && result.needsEmailConfirmation) {
      console.log("✅ Passage à l'étape de confirmation");
      
      setRegistrationState({
        step: 'confirmation',
        userEmail: values.email,
        confirmationCode: result.confirmationCode!,
        firstName: values.firstName,
        lastName: values.lastName,
        userId: result.user?.id
      });
    }
  };

  const handleConfirmCode = async (inputCode: string) => {
    setIsConfirming(true);
    setConfirmationError("");
    
    console.log("🔍 === CONFIRMATION CODE ===");
    console.log("📧 Email utilisé:", `"${registrationState.userEmail}"`);
    console.log("🔢 Code saisi:", inputCode);
    console.log("🔢 Code attendu:", registrationState.confirmationCode);
    
    try {
      if (inputCode === registrationState.confirmationCode) {
        console.log("✅ Code valide - confirmation email Supabase");
        
        const { data, error } = await supabase.functions.invoke('confirm-user-email', {
          body: {
            email: registrationState.userEmail,
            confirmationCode: inputCode
          }
        });

        if (error) {
          console.error("❌ Erreur confirmation Supabase:", error);
          setConfirmationError("Erreur lors de la confirmation. Veuillez réessayer.");
          return;
        }

        if (data.success) {
          console.log("✅ Email confirmé dans Supabase");
          
          toast({
            title: "Email confirmé !",
            description: "Votre inscription a été finalisée avec succès. Bienvenue !",
            duration: 4000
          });

          setRegistrationState(prev => ({ ...prev, step: 'success' }));
          
          setTimeout(() => {
            console.log("🚀 Redirection vers /rediger");
            navigate('/rediger', { replace: true });
          }, 1500);
        } else {
          setConfirmationError("Code de confirmation invalide. Veuillez vérifier et réessayer.");
        }
      } else {
        console.error("❌ Code invalide");
        setConfirmationError("Code de confirmation invalide. Veuillez vérifier et réessayer.");
      }
    } catch (error: any) {
      console.error("❌ Erreur confirmation:", error);
      setConfirmationError("Erreur lors de la vérification du code. Veuillez réessayer.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleResendCode = async () => {
    console.log("📧 === RENVOI CODE ===");
    console.log("📧 Email pour renvoi:", `"${registrationState.userEmail}"`);
    
    try {
      const newCode = generateOTP(6);
      console.log("🔢 Nouveau code généré:", newCode);
      
      const emailResult = await sendOTP(
        registrationState.userEmail,
        newCode,
        registrationState.firstName,
        registrationState.lastName
      );
      
      if (emailResult.success) {
        setRegistrationState(prev => ({ 
          ...prev, 
          confirmationCode: newCode 
        }));
        
        toast({
          title: "Code renvoyé !",
          description: `Un nouveau code de confirmation a été envoyé à ${registrationState.userEmail}`,
          duration: 4000
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de renvoyer le code. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("❌ Erreur renvoi code:", error);
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer le code. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  if (registrationState.step === 'success') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="space-y-2">
            <p className="font-medium">Inscription finalisée avec succès !</p>
            <p>Redirection vers votre espace en cours...</p>
          </div>
        </AlertDescription>
      </Alert>
    );
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
