import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm, FormValues } from "@/components/AuthForm";
import { getErrorMessage } from "@/utils/auth-errors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [lastResetRequest, setLastResetRequest] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log('User signed in, redirecting to dashboard');
        navigate("/dashboard");
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isSignUp) {
        console.log('Attempting signup with email:', values.email);
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.log('Signup error:', error);
          
          if (error instanceof AuthApiError) {
            try {
              const errorBody = JSON.parse(error.message);
              if (errorBody.code === "user_already_exists") {
                console.log('User already exists, switching to login mode');
                toast({
                  title: "Compte existant",
                  description: "Un compte existe déjà avec cet email. Connectez-vous.",
                });
                setIsSignUp(false);
                return;
              }
            } catch (e) {
              console.log('Error parsing error message:', e);
            }
          }
          
          const message = getErrorMessage(error);
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: message,
          });
          return;
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        console.log('Attempting login with email:', values.email);
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.log('Login error:', error);
          const message = getErrorMessage(error);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: message,
          });
          return;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      if (!email) {
        toast({
          variant: "destructive",
          title: "Email requis",
          description: "Veuillez saisir votre adresse email avant de réinitialiser votre mot de passe.",
        });
        return;
      }

      const now = Date.now();
      if (now - lastResetRequest < 60000) {
        toast({
          variant: "destructive",
          title: "Patientez",
          description: "Pour des raisons de sécurité, veuillez patienter une minute entre chaque demande.",
        });
        return;
      }

      console.log('Attempting to send password reset email to:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.log('Password reset error:', error);
        const message = getErrorMessage(error);
        toast({
          variant: "destructive",
          title: "Erreur de réinitialisation",
          description: message,
        });
        return;
      }

      setLastResetRequest(now);
      
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la demande de réinitialisation.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Créer un compte" : "Se connecter"}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isSignUp 
              ? "Inscrivez-vous pour accéder à vos directives anticipées"
              : "Connectez-vous pour accéder à vos directives anticipées"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            isSignUp={isSignUp}
            onSubmit={handleSubmit}
            onToggleMode={() => setIsSignUp(!isSignUp)}
            onForgotPassword={handleForgotPassword}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;