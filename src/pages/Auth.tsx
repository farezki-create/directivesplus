import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

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
      // Handle authentication errors
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
        default:
          console.log('Unhandled API error:', error.code, error.message);
          return "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
      }
    }
    
    console.log('Non-API error:', error.message);
    return "Une erreur inattendue s'est produite. Veuillez réessayer.";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Connexion</h1>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(var(--primary))',
                      brandAccent: 'rgb(var(--primary))',
                    },
                  },
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "Se connecter",
                    loading_button_label: "Connexion en cours...",
                    password_input_placeholder: "Votre mot de passe",
                    email_input_placeholder: "Votre adresse email",
                    link_text: "Vous avez déjà un compte ? Connectez-vous",
                  },
                  sign_up: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "S'inscrire",
                    loading_button_label: "Inscription en cours...",
                    password_input_placeholder: "Choisissez un mot de passe",
                    email_input_placeholder: "Votre adresse email",
                    link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
              view="sign_in"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;