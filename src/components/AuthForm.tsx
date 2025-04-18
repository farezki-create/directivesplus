
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ForgotPassword } from "@/components/ForgotPassword";
import { BaseAuthFields } from "./auth/BaseAuthFields";
import { SignUpFields } from "./auth/SignUpFields";
import { FormValues, loginSchema, signUpSchema } from "./auth/types";
import { useLanguage } from "@/hooks/useLanguage";

type AuthFormProps = {
  isSignUp: boolean;
  onSubmit: (values: FormValues) => void;
  onToggleMode: () => void;
};

export const AuthForm = ({ 
  isSignUp, 
  onSubmit, 
  onToggleMode,
}: AuthFormProps) => {
  const schema = isSignUp ? signUpSchema : loginSchema;
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      country: "France",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  console.log('Form mode:', isSignUp ? 'signup' : 'login');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BaseAuthFields form={form} isSignUp={isSignUp} />
        
        {isSignUp && <SignUpFields form={form} />}

        <Button type="submit" className="w-full">
          {isSignUp ? t('register') : t('signIn')}
        </Button>

        {!isSignUp && <ForgotPassword email={form.getValues("email")} />}

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isSignUp ? (
            <>
              {t('alreadyHaveAccount')}{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline"
              >
                {t('signIn')}
              </button>
            </>
          ) : (
            <>
              {t('dontHaveAccount')}{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline"
              >
                {t('register')}
              </button>
            </>
          )}
        </p>
      </form>
    </Form>
  );
};
