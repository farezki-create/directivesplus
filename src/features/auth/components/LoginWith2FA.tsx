
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginFormSchema, type LoginFormValues } from "../schemas";
import { useLoginSecurity } from "../hooks/useLoginSecurity";
import { useLoginWith2FA } from "../hooks/useLoginWith2FA";
import { LoginFormFields } from "./LoginFormFields";
import { SecurityWarningAlert } from "./SecurityWarningAlert";
import { TwoFactorAuth } from "@/components/auth/TwoFactorAuth";

interface LoginWith2FAProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginWith2FA = ({ 
  redirectPath, 
  setRedirectInProgress, 
  onForgotPassword 
}: LoginWith2FAProps) => {
  const {
    securityWarning,
    checkSecurityConstraints,
    handleSuccessfulLogin
  } = useLoginSecurity();

  const { 
    loading, 
    requiresTwoFactor,
    pendingUserId,
    handleInitialLogin,
    completeTwoFactorAuth,
    resetTwoFactor
  } = useLoginWith2FA({
    onSuccessfulLogin: handleSuccessfulLogin,
    setRedirectInProgress
  });
  
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
    
    await handleInitialLogin(values);
  };

  // Show 2FA component if required
  if (requiresTwoFactor && pendingUserId) {
    return (
      <TwoFactorAuth
        userId={pendingUserId}
        onVerificationComplete={completeTwoFactorAuth}
        onBack={resetTwoFactor}
      />
    );
  }

  // Show normal login form
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
};
