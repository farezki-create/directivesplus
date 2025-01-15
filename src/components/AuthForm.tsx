import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginSchema, signUpSchema, FormValues } from "./auth/types";
import { LoginFields } from "./auth/LoginFields";
import { SignUpFields } from "./auth/SignUpFields";

type AuthFormProps = {
  isSignUp: boolean;
  onSubmit: (values: FormValues) => void;
  onToggleMode: () => void;
};

export { type FormValues };
export const AuthForm = ({ isSignUp, onSubmit, onToggleMode }: AuthFormProps) => {
  const schema = isSignUp ? signUpSchema : loginSchema;
  
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
        {isSignUp ? (
          <SignUpFields form={form} />
        ) : (
          <LoginFields form={form} />
        )}

        <Button type="submit" className="w-full">
          {isSignUp ? "S'inscrire" : "Se connecter"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isSignUp ? (
            <>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline"
              >
                Connectez-vous
              </button>
            </>
          ) : (
            <>
              Vous n'avez pas de compte ?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline"
              >
                Inscrivez-vous
              </button>
            </>
          )}
        </p>
      </form>
    </Form>
  );
};