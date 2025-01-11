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
          
          // Handle user_already_exists error specifically
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
          
          // Handle other errors
          const message = getErrorMessage(error);
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: message,
          });
          throw error;
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
          throw error;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;