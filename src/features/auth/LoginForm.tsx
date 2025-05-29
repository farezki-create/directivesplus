
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginFormSchema, type LoginFormValues } from "./schemas";
import { useLoginSecurity } from "./hooks/useLoginSecurity";
import { useLoginSubmit } from "./hooks/useLoginSubmit";
import { LoginFormFields } from "./components/LoginFormFields";
import { SecurityWarningAlert } from "./components/SecurityWarningAlert";

interface LoginFormProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ redirectPath, setRedirectInProgress, onForgotPassword }: LoginFormProps) => {
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
    
    await handleSubmit(values);
  };

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
