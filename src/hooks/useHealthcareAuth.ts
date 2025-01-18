import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";

// Types for our healthcare professional data
type HealthcareProfessional = {
  id: string;
  cps_number: string;
  professional_type: string;
  first_name: string;
  last_name: string;
};

export const useHealthcareAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async (values: FormValues) => {
    console.log('Attempting healthcare professional signup');
    
    const { error: signUpError, data } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          user_type: 'healthcare_professional'
        }
      }
    });

    if (signUpError) {
      console.error('Healthcare signup error:', signUpError);
      showErrorToast("Erreur d'inscription", getErrorMessage(signUpError));
      return false;
    }

    if (data.user) {
      await createHealthcareProfessionalProfile(data.user.id, values);
    }

    showSuccessToast(
      "Inscription réussie",
      "Veuillez vérifier votre email pour confirmer votre compte."
    );
    return true;
  };

  const createHealthcareProfessionalProfile = async (userId: string, values: FormValues) => {
    const { error: profileError } = await supabase
      .from('healthcare_professionals')
      .insert([{
        id: userId,
        cps_number: values.cpsNumber,
        professional_type: values.professionalType || 'doctor',
        first_name: values.firstName,
        last_name: values.lastName,
        rpps_number: values.rppsNumber,
        specialty: values.specialty
      }]);

    if (profileError) {
      console.error('Error creating healthcare professional profile:', profileError);
      showErrorToast(
        "Erreur de profil",
        "Impossible de créer le profil professionnel. Veuillez réessayer."
      );
      return false;
    }
    return true;
  };

  const verifyHealthcareProfessional = async (userId: string) => {
    const { data: healthcareProfessional, error: fetchError } = await supabase
      .from('healthcare_professionals')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !healthcareProfessional) {
      console.error('Not a healthcare professional:', fetchError);
      showErrorToast(
        "Accès refusé",
        "Ce compte n'est pas un compte professionnel de santé."
      );
      await supabase.auth.signOut();
      return false;
    }
    return true;
  };

  const handleSignIn = async (values: FormValues) => {
    console.log('Attempting healthcare professional login');
    
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (signInError) {
      console.error('Healthcare login error:', signInError);
      const errorMessage = signInError.message.includes("Email not confirmed")
        ? "Veuillez confirmer votre email avant de vous connecter"
        : "Email ou mot de passe incorrect";
      
      showErrorToast("Erreur de connexion", errorMessage);
      return false;
    }

    if (authData.user) {
      const isHealthcareProfessional = await verifyHealthcareProfessional(authData.user.id);
      if (!isHealthcareProfessional) return false;

      showSuccessToast("Connexion réussie", "Vous êtes maintenant connecté.");
      navigate("/healthcare-dashboard");
      return true;
    }
    return false;
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      variant: "destructive",
      title,
      description,
    });
  };

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const handleSubmit = async (values: FormValues) => {
    console.log('Attempting healthcare auth with email:', values.email);

    try {
      if (isSignUp) {
        await handleSignUp(values);
      } else {
        await handleSignIn(values);
      }
    } catch (error) {
      console.error('Healthcare auth error:', error);
      showErrorToast("Erreur", "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    handleSubmit,
  };
};