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
      switch (error.message) {
        case "Invalid login credentials":
          return "Email ou mot de passe incorrect.";
        case "Email not confirmed":
          return "Veuillez vérifier votre email pour confirmer votre compte.";
        case "Password should be at least 8 characters":
          return "Le mot de passe doit contenir au moins 8 caractères.";
        default:
          console.log('Unhandled API error:', error.message);
          return error.message;
      }
    }
    
    console.log('Non-API error:', error.message);
    return error.message;
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
                    password_input_placeholder: "Minimum 8 caractères, 1 majuscule, 1 chiffre",
                  },
                  sign_up: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "S'inscrire",
                    password_input_placeholder: "Minimum 8 caractères, 1 majuscule, 1 chiffre",
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;