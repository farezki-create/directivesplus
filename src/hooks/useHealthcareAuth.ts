import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

export const useHealthcareAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    console.log('Attempting healthcare login with email:', values.email);

    try {
      if (isSignUp) {
        console.log('Attempting healthcare professional signup with email:', values.email);
        
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
          console.log('Healthcare signup error:', signUpError);
          const message = getErrorMessage(signUpError);
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: message,
          });
          return;
        }

        if (data.user) {
          const { error: profileError } = await supabase
            .from('healthcare_professionals')
            .insert([
              {
                id: data.user.id,
                cps_number: values.cpsNumber,
                professional_type: values.professionalType || 'doctor',
                first_name: values.firstName,
                last_name: values.lastName,
                rpps_number: values.rppsNumber,
                specialty: values.specialty
              }
            ]);

          if (profileError) {
            console.error('Error creating healthcare professional profile:', profileError);
            toast({
              variant: "destructive",
              title: "Erreur de profil",
              description: "Impossible de créer le profil professionnel. Veuillez réessayer.",
            });
            return;
          }
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
          console.log('Healthcare login error:', error);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: getErrorMessage(error as AuthError),
          });
          return;
        }

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        navigate("/healthcare-dashboard");
      }
    } catch (error) {
      console.error('Healthcare auth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
      });
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    handleSubmit,
  };
};
