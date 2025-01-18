import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Healthcare = () => {
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
        console.log('Attempting healthcare login with email:', values.email);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {isSignUp ? "Inscription Professionnel de Santé" : "Connexion Professionnel de Santé"}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp 
            ? "Créez votre compte professionnel de santé" 
            : "Connectez-vous à votre compte professionnel"}
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <AuthForm
          isSignUp={isSignUp}
          onSubmit={handleSubmit}
          onToggleMode={() => setIsSignUp(!isSignUp)}
          isHealthcareProfessional={true}
        />
      </div>
    </div>
  );
};

export default Healthcare;