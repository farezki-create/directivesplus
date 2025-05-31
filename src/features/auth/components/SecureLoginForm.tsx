
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginFormSchema, type LoginFormValues } from "../schemas";
import { useLoginSecurity } from "../hooks/useLoginSecurity";
import { useLoginSubmit } from "../hooks/useLoginSubmit";
import { LoginFormFields } from "./LoginFormFields";
import { SecurityWarningAlert } from "./SecurityWarningAlert";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { TwoFactorVerification } from "./TwoFactorVerification";
import { useSecure2FA } from "../hooks/useSecure2FA";

interface SecureLoginFormProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const SecureLoginForm = ({ redirectPath, setRedirectInProgress, onForgotPassword }: SecureLoginFormProps) => {
  const [userEmail, setUserEmail] = useState('');
  const [loginData, setLoginData] = useState<LoginFormValues | null>(null);
  
  const {
    securityWarning,
    checkSecurityConstraints,
    handleSuccessfulLogin
  } = useLoginSecurity();

  const { loading, handleSubmit } = useLoginSubmit({
    redirectPath,
    setRedirectInProgress,
    onSuccessfulLogin: handleSuccessfulLogin
  });

  const {
    currentStep,
    verificationMethod,
    expectedCode,
    handleVerificationSent,
    handleVerificationSuccess,
    resetToSetup
  } = useSecure2FA();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const securityCheck = await checkSecurityConstraints(values.email);
    if (!securityCheck.allowed) return;
    
    // Stocker les données de connexion et l'email pour la 2FA
    setLoginData(values);
    setUserEmail(values.email);
    
    // Note: En production, vous devriez d'abord vérifier les identifiants
    // avant de passer à la 2FA. Ici on passe directement à la 2FA pour la démo.
  };

  const handleFinal2FASuccess = async () => {
    if (loginData) {
      // Maintenant que la 2FA est validée, on procède à la vraie connexion
      await handleSubmit(loginData);
    }
  };

  // Étape 1: Formulaire de connexion standard
  if (!loginData) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SecurityWarningAlert warning={securityWarning} />
          <LoginFormFields form={form} onForgotPassword={onForgotPassword} />
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Form>
    );
  }

  // Étape 2: Configuration 2FA
  if (currentStep === 'setup') {
    return (
      <TwoFactorSetup 
        userEmail={userEmail}
        onVerificationSent={handleVerificationSent}
      />
    );
  }

  // Étape 3: Vérification du code
  if (currentStep === 'verification') {
    return (
      <TwoFactorVerification
        method={verificationMethod}
        expectedCode={expectedCode}
        onVerificationSuccess={handleFinal2FASuccess}
        onBack={resetToSetup}
      />
    );
  }

  // Étape 4: Succès - la connexion finale se fait automatiquement
  return (
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      <p>Connexion sécurisée en cours...</p>
    </div>
  );
};
