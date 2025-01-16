import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { getErrorMessage } from "@/utils/auth-errors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

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

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      console.log(`Attempting to sign in with ${provider}`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error(`${provider} login error:`, error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: getErrorMessage(error),
        });
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {isSignUp && (
        <Button
          variant="ghost"
          className="absolute top-4 left-4 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Button>
      )}
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('google')}
            >
              <img
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Continuer avec Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('apple')}
            >
              <img
                src="https://authjs.dev/img/providers/apple.svg"
                alt="Apple"
                className="h-5 w-5 mr-2"
              />
              Continuer avec Apple
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('facebook')}
            >
              <img
                src="https://authjs.dev/img/providers/facebook.svg"
                alt="Facebook"
                className="h-5 w-5 mr-2"
              />
              Continuer avec Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuez avec
              </span>
            </div>
          </div>

          <AuthForm
            isSignUp={isSignUp}
            onSubmit={async (values) => {
              try {
                if (isSignUp) {
                  console.log('Attempting signup with email:', values.email);
                  const { error } = await supabase.auth.signUp({
                    email: values.email,
                    password: values.password,
                    options: {
                      data: {
                        first_name: values.firstName,
                        last_name: values.lastName,
                        birth_date: values.birthDate,
                        address: values.address,
                        city: values.city,
                        postal_code: values.postalCode,
                        country: values.country,
                        phone_number: values.phoneNumber,
                      },
                      emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                  });

                  if (error) {
                    console.log('Signup error:', error);
                    
                    if (error instanceof AuthApiError && error.message.includes("User already registered")) {
                      console.log('User already exists, switching to login mode');
                      toast({
                        title: "Compte existant",
                        description: "Un compte existe déjà avec cet email. Connectez-vous.",
                      });
                      setIsSignUp(false);
                      return;
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
                toast({
                  variant: "destructive",
                  title: "Erreur",
                  description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
                });
              }
            }}
            onToggleMode={() => setIsSignUp(!isSignUp)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;