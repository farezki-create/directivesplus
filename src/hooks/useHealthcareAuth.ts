import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { useToast } from "@/components/ui/use-toast";

export const useHealthcareAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    console.log('Attempting healthcare auth with email:', values.email);

    try {
      if (isSignUp) {
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
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: getErrorMessage(signUpError),
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
        console.log('Attempting healthcare professional login');
        
        // First, try to sign in
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (signInError) {
          console.error('Healthcare login error:', signInError);
          let errorMessage = "Email ou mot de passe incorrect";
          if (signInError.message.includes("Email not confirmed")) {
            errorMessage = "Veuillez confirmer votre email avant de vous connecter";
          }
          
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: errorMessage,
          });
          return;
        }

        if (authData.user) {
          // Verify if the user is a healthcare professional
          const { data: healthcareProfessional, error: fetchError } = await supabase
            .from('healthcare_professionals')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (fetchError || !healthcareProfessional) {
            console.error('Not a healthcare professional:', fetchError);
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Ce compte n'est pas un compte professionnel de santé.",
            });
            // Sign out the user since they're not a healthcare professional
            await supabase.auth.signOut();
            return;
          }

          console.log('Healthcare professional login successful');
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté.",
          });
          
          navigate("/healthcare-dashboard");
        }
      }
    } catch (error) {
      console.error('Healthcare auth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    handleSubmit,
  };
};