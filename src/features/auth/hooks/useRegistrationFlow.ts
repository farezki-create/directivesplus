
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEmailConfirmationSignup } from "@/hooks/useEmailConfirmationSignup";
import { useOTPEmailSender } from "@/hooks/useOTPEmailSender";
import { generateOTP } from "@/utils/otpGenerator";
import { RegisterFormValues } from "../schemas";

interface UseRegistrationFlowProps {
  registrationState: any;
  updateRegistrationState: (updates: any) => void;
  setConfirmationError: (error: string) => void;
  setIsConfirming: (loading: boolean) => void;
  resetConfirmationError: () => void;
}

export const useRegistrationFlow = ({
  registrationState,
  updateRegistrationState,
  setConfirmationError,
  setIsConfirming,
  resetConfirmationError
}: UseRegistrationFlowProps) => {
  const navigate = useNavigate();
  const { signUp, isLoading } = useEmailConfirmationSignup();
  const { sendOTP } = useOTPEmailSender();

  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("🔍 === DEBUG REGISTRATION FLOW ===");
    console.log("📧 Email REÇU dans handleSubmit:", `"${values.email}"`);
    console.log("📧 Type de l'email:", typeof values.email);
    console.log("📧 Longueur de l'email:", values.email?.length);
    console.log("📝 Valeurs complètes du formulaire:", {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName
    });
    
    // Nettoyer l'email au cas où
    const cleanEmail = values.email?.trim();
    console.log("📧 Email après nettoyage:", `"${cleanEmail}"`);
    
    const cleanedValues = {
      ...values,
      email: cleanEmail
    };
    
    console.log("📧 Valeurs nettoyées envoyées à signUp:", cleanedValues.email);
    
    const result = await signUp(cleanedValues);
    
    if (result.success && result.needsEmailConfirmation) {
      console.log("✅ Passage à l'étape de confirmation");
      console.log("📧 Email qui sera stocké dans l'état:", cleanEmail);
      
      updateRegistrationState({
        step: 'confirmation',
        userEmail: cleanEmail,
        confirmationCode: result.confirmationCode!,
        firstName: values.firstName,
        lastName: values.lastName,
        userId: result.user?.id
      });
    }
  };

  const handleConfirmCode = async (inputCode: string) => {
    setIsConfirming(true);
    resetConfirmationError();
    
    console.log("🔍 === CONFIRMATION CODE DEBUG ===");
    console.log("📧 Email depuis registrationState:", `"${registrationState.userEmail}"`);
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

          updateRegistrationState({ step: 'success' });
          
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
    console.log("📧 === RENVOI CODE DEBUG ===");
    console.log("📧 Email pour renvoi depuis state:", `"${registrationState.userEmail}"`);
    
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
        updateRegistrationState({ confirmationCode: newCode });
        
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

  return {
    handleSubmit,
    handleConfirmCode,
    handleResendCode,
    isLoading
  };
};
