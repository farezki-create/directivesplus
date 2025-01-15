import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        console.log('User signed in successfully, redirecting to home page');
        sessionStorage.setItem('showExplanationDialog', 'true');
        navigate("/");
      }

      // Log any URL-related errors
      if (event === "USER_DELETED" || event === "SIGNED_OUT") {
        console.log('Auth event:', event);
      }
    });

    // Check for redirect error in URL
    const hash = window.location.hash;
    if (hash && hash.includes('error')) {
      console.error('Redirect error detected:', hash);
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Une erreur est survenue lors de la redirection. Veuillez réessayer.",
      });
    }

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSubmit = async (values: FormValues) => {
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
              country: values.country,
              phone_number: values.phoneNumber,
              address: values.address,
              city: values.city,
              postal_code: values.postalCode,
            }
          }
        });

        if (error) {
          console.error('Signup error:', error);
          
          if (error instanceof AuthApiError) {
            // Check for specific error codes
            if (error.status === 400) {
              if (error.message.includes("User already registered")) {
                toast({
                  title: "Compte existant",
                  description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
                  variant: "destructive",
                });
                setIsSignUp(false);
                return;
              }
            }

            // Check for URL-related errors
            if (error.message.includes("failed to call url") || error.message.includes("404")) {
              console.error('URL configuration error:', error);
              toast({
                variant: "destructive",
                title: "Erreur de configuration",
                description: "Une erreur de configuration est survenue. Veuillez contacter le support.",
              });
              return;
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
          console.error('Login error:', error);
          
          if (error instanceof AuthApiError) {
            // Handle specific login error codes
            if (error.status === 400 && error.message.includes("Invalid login credentials")) {
              toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.",
              });
              return;
            }

            // Check for URL-related errors
            if (error.message.includes("failed to call url") || error.message.includes("404")) {
              console.error('URL configuration error:', error);
              toast({
                variant: "destructive",
                title: "Erreur de configuration",
                description: "Une erreur de configuration est survenue. Veuillez contacter le support.",
              });
              return;
            }
          }
          
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
      console.error('Unexpected auth error:', error);
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