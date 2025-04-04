
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthCard } from "@/components/auth/AuthCard";
import { useLanguage } from "@/hooks/useLanguage";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const { setLanguage } = useLanguage();

  const searchParams = new URLSearchParams(location.search);
  const isWritingMode = searchParams.get('writing') === 'true';

  useEffect(() => {
    setLanguage('fr');
    
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log('User signed in, redirecting to writing mode');
        // Always redirect to writing mode after successful sign in
        navigate("/?writing=true");
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, setLanguage]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isSignUp) {
        console.log('Attempting signup with email:', values.email);
        const { error, data } = await supabase.auth.signUp({
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

        try {
          if (data?.user?.email) {
            const response = await supabase.functions.invoke('send-verification-email', {
              body: {
                to: values.email,
                confirmationUrl: `${window.location.origin}/auth/verify`,
              },
            });

            if (response.error) {
              console.error('Erreur lors de l\'envoi de l\'email de vérification:', response.error);
            }
          }
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        console.log('Attempting login with email:', values.email);
        const { error, data } = await supabase.auth.signInWithPassword({
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

        console.log('Login successful:', data);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        // Always redirect to writing mode after login
        navigate("/?writing=true");
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <AuthHeader isSignUp={isSignUp} />
      
      <div className="w-full max-w-md space-y-8">
        <AuthLogo />
        <AuthCard
          isSignUp={isSignUp}
          onSubmit={handleSubmit}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </div>
    </div>
  );
};

export default Auth;
