import { useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { ForgotPassword } from "@/components/ForgotPassword";
import { getErrorMessage } from "@/utils/auth-errors";
import { useAuthState } from "@/hooks/useAuthState";
import { FormValues } from "@/components/auth/types";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useAuthState();

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log('Attempting auth with values:', values);
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error('Signup error:', error);
          throw error;
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error('Signin error:', error);
          throw error;
        }

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
      }
    } catch (error) {
      console.error('Error in auth:', error);
      const message = error instanceof AuthApiError 
        ? getErrorMessage(error)
        : "Une erreur est survenue lors de l'authentification.";
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <AuthForm
        isSignUp={isSignUp}
        onSubmit={handleSubmit}
        onToggleMode={() => setIsSignUp(!isSignUp)}
      />
      {!isSignUp && (
        <ForgotPassword email="" />
      )}
    </div>
  );
};

export default Auth;