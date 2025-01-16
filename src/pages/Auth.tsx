import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/utils/auth-errors";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import type { FormValues } from "@/components/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log('User signed in successfully, redirecting to home');
        navigate("/");
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      if (isSignUp) {
        console.log('Starting signup process with values:', {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          birthDate: values.birthDate,
          country: values.country,
          phoneNumber: values.phoneNumber,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode
        });

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
          console.error('Signup error:', error);
          
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

        console.log('Signup successful, showing confirmation toast');
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
        
        // Redirect to home page after successful signup
        navigate("/");
      } else {
        console.log('Starting login process with email:', values.email);
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error('Login error:', error);
          const message = getErrorMessage(error);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: message,
          });
          return;
        }

        console.log('Login successful');
        // The redirect will be handled by the auth state change listener
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <header className="py-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">DirectivesPlus</h1>
          <p className="text-muted-foreground">
            Vos directives anticipées en toute sécurité
          </p>
        </header>
        
        <div className="flex justify-center items-start">
          <div className="w-full max-w-md">
            {isSignUp && (
              <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            )}
            
            <AuthCard
              isSignUp={isSignUp}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onToggleMode={() => setIsSignUp(!isSignUp)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;