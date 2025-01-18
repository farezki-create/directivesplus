import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";

export const useHealthcareAuth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up healthcare auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Healthcare auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log('Healthcare professional signed in, redirecting to dashboard');
        navigate("/dashboard");
      }
    });

    return () => {
      console.log("Cleaning up healthcare auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isSignUp) {
        console.log('Attempting healthcare professional signup with email:', values.email);
        
        // For development: accept any valid email/password
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
                cps_number: values.cpsNumber || 'test123', // Default value for development
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
        console.log('Attempting healthcare login with email:', values.email);
        
        // For development: special case for test@test/test credentials
        if (values.email === 'test@test' && values.password === 'test') {
          console.log('Using test credentials');
          // Create a new user if it doesn't exist
          const { data: existingUser } = await supabase
            .from('healthcare_professionals')
            .select('id')
            .single();

          if (!existingUser) {
            console.log('Creating test healthcare professional account');
            const { data: { user }, error: signUpError } = await supabase.auth.signUp({
              email: 'test@test',
              password: 'test',
              options: {
                data: {
                  first_name: 'Test',
                  last_name: 'User',
                  user_type: 'healthcare_professional'
                }
              }
            });

            if (signUpError) {
              console.error('Error creating test account:', signUpError);
              toast({
                variant: "destructive",
                title: "Erreur de création du compte test",
                description: getErrorMessage(signUpError),
              });
              return;
            }

            if (user) {
              const { error: profileError } = await supabase
                .from('healthcare_professionals')
                .insert([
                  {
                    id: user.id,
                    cps_number: 'test123',
                    professional_type: 'doctor',
                    first_name: 'Test',
                    last_name: 'User',
                    specialty: 'Test Specialty'
                  }
                ]);

              if (profileError) {
                console.error('Error creating test profile:', profileError);
                toast({
                  variant: "destructive",
                  title: "Erreur de profil",
                  description: "Impossible de créer le profil test.",
                });
                return;
              }
            }
          }
        }

        // Attempt to sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.log('Healthcare login error:', error);
          const message = getErrorMessage(error);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: message,
          });
          return;
        }

        console.log('Healthcare login successful');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Healthcare auth error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    handleSubmit
  };
};