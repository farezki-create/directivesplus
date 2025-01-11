import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
      if (event === "SIGNED_OUT") {
        navigate("/");
        setErrorMessage("");
      }
      if (event === "USER_UPDATED" || event === "INITIAL_SESSION") {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.log('Auth error:', error);
          const translatedError = getErrorMessage(error);
          setErrorMessage(translatedError);
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: translatedError,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    console.log('Processing error:', error);
    
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case "invalid_credentials":
          return "Email ou mot de passe incorrect.";
        case "email_not_confirmed":
          return "Veuillez vérifier votre email pour confirmer votre compte.";
        case "invalid_grant":
          return "Email ou mot de passe incorrect.";
        case "user_already_exists":
          return "Un compte existe déjà avec cet email. Veuillez vous connecter.";
        case "password_too_short":
          return "Le mot de passe doit contenir au moins 8 caractères.";
        case "weak_password":
          return "Le mot de passe est trop faible. Il doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
        case "passwords_mismatch":
          return "Les mots de passe ne correspondent pas.";
        default:
          console.log('Unhandled API error:', error.code, error.message);
          return "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
      }
    }
    
    console.log('Non-API error:', error.message);
    return "Une erreur inattendue s'est produite. Veuillez réessayer.";
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: message,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            {isSignUp ? "Inscription" : "Connexion"}
          </h1>
          
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="bg-card p-6 rounded-lg shadow-sm">
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

                <p className="text-center text-sm text-muted-foreground mt-4">
                  {isSignUp ? (
                    <>
                      Vous avez déjà un compte ?{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(false)}
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
                        onClick={() => setIsSignUp(true)}
                        className="text-primary hover:underline"
                      >
                        Inscrivez-vous
                      </button>
                    </>
                  )}
                </p>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;