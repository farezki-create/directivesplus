
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
    console.log("🔍 === DEBUG REGISTRATION FLOW - FORMULAIRE ===");
    console.log("📧 Email EXACT du formulaire:", `"${values.email}"`);
    console.log("📧 Type de l'email:", typeof values.email);
    console.log("📧 Longueur de l'email:", values.email?.length);
    console.log("📝 TOUTES les valeurs du formulaire:", JSON.stringify(values, null, 2));
    
    // Vérification stricte que l'email n'est pas vide
    if (!values.email || values.email.trim().length === 0) {
      console.error("❌ Email vide détecté !");
      toast({
        title: "Erreur",
        description: "L'adresse email est requise",
        variant: "destructive"
      });
      return;
    }
    
    // Nettoyage strict de l'email
    const cleanEmail = values.email.trim().toLowerCase();
    console.log("📧 Email après nettoyage strict:", `"${cleanEmail}"`);
    
    // Vérification que l'email nettoyé n'est pas l'ancien email
    if (cleanEmail === "arezki_farid@hotmail.com") {
      console.error("❌ DÉTECTION DE L'ANCIEN EMAIL ! Email détecté:", cleanEmail);
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez saisir votre nouvelle adresse email",
        variant: "destructive"
      });
      return;
    }
    
    // Création d'un nouvel objet avec l'email nettoyé
    const cleanedValues: RegisterFormValues = {
      firstName: values.firstName?.trim() || "",
      lastName: values.lastName?.trim() || "",
      gender: values.gender,
      birthDate: values.birthDate || "",
      email: cleanEmail,
      address: values.address?.trim() || "",
      phoneNumber: values.phoneNumber?.trim() || "",
      password: values.password || "",
      passwordConfirm: values.passwordConfirm || ""
    };
    
    console.log("📧 VALEURS FINALES envoyées à signUp:", JSON.stringify(cleanedValues, null, 2));
    console.log("📧 EMAIL FINAL qui sera traité:", `"${cleanedValues.email}"`);
    
    const result = await signUp(cleanedValues);
    
    if (result.success && result.needsEmailConfirmation) {
      console.log("✅ Passage à l'étape de confirmation");
      console.log("📧 Email qui sera stocké dans l'état:", `"${cleanedValues.email}"`);
      
      updateRegistrationState({
        step: 'confirmation',
        userEmail: cleanedValues.email,
        confirmationCode: result.confirmationCode!,
        firstName: cleanedValues.firstName,
        lastName: cleanedValues.lastName,
        userId: result.user?.id
      });
    }
  };

  const handleConfirmCode = async (inputCode: string) => {
    setIsConfirming(true);
    resetConfirmationError();
    
    console.log("🔍 === CONFIRMATION CODE DEBUG DÉTAILLÉ ===");
    console.log("📧 Email depuis registrationState:", `"${registrationState.userEmail}"`);
    console.log("🔢 Code saisi par l'utilisateur:", `"${inputCode}"`);
    console.log("🔢 Code attendu dans l'état:", `"${registrationState.confirmationCode}"`);
    console.log("🔢 Type du code saisi:", typeof inputCode);
    console.log("🔢 Type du code attendu:", typeof registrationState.confirmationCode);
    console.log("🔢 Longueur code saisi:", inputCode?.length);
    console.log("🔢 Longueur code attendu:", registrationState.confirmationCode?.length);
    console.log("👤 User ID:", registrationState.userId);
    
    try {
      // Nettoyage des codes pour comparaison
      const cleanInputCode = inputCode.trim();
      const cleanExpectedCode = registrationState.confirmationCode?.trim();
      
      console.log("🔢 Codes après nettoyage:");
      console.log("  - Code saisi nettoyé:", `"${cleanInputCode}"`);
      console.log("  - Code attendu nettoyé:", `"${cleanExpectedCode}"`);
      console.log("🔢 Comparaison exacte:", cleanInputCode === cleanExpectedCode);
      
      if (cleanInputCode === cleanExpectedCode) {
        console.log("✅ Code valide - tentative confirmation email Supabase");
        console.log("📤 Envoi vers confirm-user-email avec:");
        console.log("  - Email:", `"${registrationState.userEmail}"`);
        console.log("  - Code:", `"${cleanInputCode}"`);
        
        const { data, error } = await supabase.functions.invoke('confirm-user-email', {
          body: {
            email: registrationState.userEmail,
            confirmationCode: cleanInputCode
          }
        });

        console.log("📥 Réponse de confirm-user-email:");
        console.log("  - Data:", JSON.stringify(data, null, 2));
        console.log("  - Error:", JSON.stringify(error, null, 2));

        if (error) {
          console.error("❌ Erreur Edge Function:", error);
          setConfirmationError(`Erreur technique: ${error.message}. Veuillez réessayer.`);
          return;
        }

        if (data?.success) {
          console.log("✅ Email confirmé avec succès dans Supabase");
          
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
          console.error("❌ Réponse négative de l'Edge Function:", data);
          setConfirmationError(data?.error || "Code de confirmation invalide selon le serveur. Veuillez vérifier et réessayer.");
        }
      } else {
        console.error("❌ Code invalide - comparaison locale échouée");
        console.error("  Expected:", `"${cleanExpectedCode}"`);
        console.error("  Received:", `"${cleanInputCode}"`);
        setConfirmationError("Code de confirmation invalide. Veuillez vérifier et réessayer.");
      }
    } catch (error: any) {
      console.error("❌ Erreur inattendue lors de la confirmation:", error);
      console.error("Stack trace:", error.stack);
      setConfirmationError(`Erreur inattendue: ${error.message}. Veuillez réessayer.`);
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
