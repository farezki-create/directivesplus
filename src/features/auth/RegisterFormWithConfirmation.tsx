
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormValues } from "./schemas";
import { FormLayout } from "./components/FormLayout";
import { PersonalInfoFields } from "./components/PersonalInfoFields";
import { ContactInfoFields } from "./components/ContactInfoFields";
import { PasswordFields } from "./components/PasswordFields";
import { FormSubmitButton } from "./components/FormSubmitButton";
import { useRegisterWithConfirmation } from "./hooks/useRegisterWithConfirmation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { ConfirmationCodeInput } from "./components/ConfirmationCodeInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSendOTP } from "@/hooks/useSendOTP";
import { generateOTP } from "@/utils/otpGenerator";

interface RegisterFormWithConfirmationProps {
  onSuccess?: () => void;
}

export const RegisterFormWithConfirmation = ({ onSuccess }: RegisterFormWithConfirmationProps) => {
  const [registrationState, setRegistrationState] = useState<{
    step: 'form' | 'confirmation' | 'success';
    formData?: RegisterFormValues; // Stocker toutes les données du formulaire
    confirmationCode?: string;
    userId?: string;
  }>({ step: 'form' });

  const [confirmationError, setConfirmationError] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  
  const navigate = useNavigate();
  const { sendOTP } = useSendOTP();

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

  const { register, isLoading } = useRegisterWithConfirmation();

  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("📝 Soumission inscription avec confirmation:", values.email);
    console.log("📧 Email exact du formulaire:", values.email);
    
    const result = await register(values);
    
    if (result.success && result.needsEmailConfirmation) {
      console.log("✅ Inscription réussie, passage à l'étape de confirmation");
      console.log("📧 Email stocké pour confirmation:", values.email);
      
      setRegistrationState({
        step: 'confirmation',
        formData: values, // Stocker toutes les données du formulaire
        confirmationCode: result.confirmationCode,
        userId: result.user?.id
      });
    }
  };

  const handleConfirmCode = async (inputCode: string) => {
    setIsConfirming(true);
    setConfirmationError("");
    
    try {
      console.log("🔍 Vérification du code de confirmation");
      console.log("📧 Email utilisé pour confirmation:", registrationState.formData?.email);
      
      // Vérifier le code (ici on compare avec le code généré)
      if (inputCode === registrationState.confirmationCode) {
        console.log("✅ Code de confirmation valide");
        
        // Maintenant on doit confirmer l'email dans Supabase
        const { data, error } = await supabase.functions.invoke('confirm-user-email', {
          body: {
            email: registrationState.formData?.email, // Utiliser l'email du formulaire
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
    try {
      console.log("📧 Renvoi du code de confirmation");
      console.log("📧 Email pour renvoi:", registrationState.formData?.email);
      
      const newCode = generateOTP(6);
      
      const emailResult = await sendOTP({
        email: registrationState.formData?.email || '', // Utiliser l'email du formulaire
        code: newCode,
        firstName: registrationState.formData?.firstName,
        lastName: registrationState.formData?.lastName
      });
      
      if (emailResult.success) {
        setRegistrationState(prev => ({ 
          ...prev, 
          confirmationCode: newCode 
        }));
        
        toast({
          title: "Code renvoyé !",
          description: "Un nouveau code de confirmation a été envoyé à votre email.",
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
        email={registrationState.formData?.email || ''} // Utiliser l'email du formulaire
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
