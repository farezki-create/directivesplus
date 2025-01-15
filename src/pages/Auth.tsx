import { useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { ForgotPassword } from "@/components/ForgotPassword";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { useAuthState } from "@/hooks/useAuthState";

const Auth = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useAuthState();

  const handleSignUp = async (email: string, password: string) => {
    try {
      console.log('Attempting signup with email:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
    } catch (error) {
      console.error('Error in handleSignUp:', error);
      const message = error instanceof AuthApiError 
        ? getAuthErrorMessage(error.message)
        : "Une erreur est survenue lors de l'inscription.";
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signin with email:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        throw error;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
    } catch (error) {
      console.error('Error in handleSignIn:', error);
      const message = error instanceof AuthApiError 
        ? getAuthErrorMessage(error.message)
        : "Une erreur est survenue lors de la connexion.";
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for email:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre email pour réinitialiser votre mot de passe.",
      });
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Error in handleForgotPassword:', error);
      const message = error instanceof AuthApiError 
        ? getAuthErrorMessage(error.message)
        : "Une erreur est survenue lors de la réinitialisation du mot de passe.";
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onSubmit={handleForgotPassword}
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <AuthForm
      onSignUp={handleSignUp}
      onSignIn={handleSignIn}
      onForgotPassword={() => setShowForgotPassword(true)}
    />
  );
};

export default Auth;