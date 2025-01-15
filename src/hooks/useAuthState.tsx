import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log('Starting signup process with email:', values.email);
      
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        const message = getErrorMessage(error);
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: message,
        });
        return;
      }

      console.log('Signup successful, showing success toast');
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
      
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with email:', values.email);
      
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

      console.log('Login successful, user will be redirected');
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (isLoading) {
      console.log('Submission blocked - already loading');
      return;
    }
    
    console.log('Form submitted with values:', values);
    if (values.confirmPassword) {
      await handleSignUp(values);
    } else {
      await handleSignIn(values);
    }
  };

  return {
    isLoading,
    showForgotPassword,
    setShowForgotPassword,
    handleSubmit,
  };
};