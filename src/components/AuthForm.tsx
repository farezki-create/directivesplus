import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type FormValues = z.infer<typeof formSchema>;

type AuthFormProps = {
  isSignUp: boolean;
  onSubmit: (values: FormValues) => void;
  onToggleMode: () => void;
  onForgotPassword: (email: string) => void;
};

export const AuthForm = ({ isSignUp, onSubmit, onToggleMode, onForgotPassword }: AuthFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleForgotPassword = () => {
    const email = form.getValues("email");
    onForgotPassword(email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Votre adresse email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mot de passe
                {isSignUp && " (8 caractères min., 1 majuscule, 1 chiffre)"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder={isSignUp ? "Choisissez un mot de passe fort" : "Votre mot de passe"} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSignUp && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Retapez votre mot de passe" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          {isSignUp ? "S'inscrire" : "Se connecter"}
        </Button>

        {!isSignUp && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-sm text-primary hover:underline mt-2"
          >
            Mot de passe oublié ?
          </button>
        )}

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