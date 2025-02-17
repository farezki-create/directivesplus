
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/auth/types";
import { getErrorMessage } from "@/utils/auth-errors";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthCard } from "@/components/auth/AuthCard";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const returnTo = searchParams.get("returnTo") || "/";

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        if (error.message.includes('refresh_token_not_found')) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Session expirée",
            description: "Veuillez vous reconnecter.",
          });
        }
        return;
      }

      if (session) {
        console.log('Session active, redirection vers:', returnTo);
        navigate(returnTo);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Changement état auth:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('Utilisateur connecté, redirection vers:', returnTo);
        navigate(returnTo);
      }

      if (event === 'SIGNED_OUT') {
        console.log('Utilisateur déconnecté');
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, returnTo, toast]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isSignUp) {
        if (!values.firstName || !values.lastName) {
          toast({
            variant: "destructive",
            title: "Champs requis",
            description: "Le prénom et le nom sont requis.",
          });
          return;
        }

        console.log('Tentative inscription avec:', values.email);
        const { error, data } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              first_name: values.firstName,
              last_name: values.lastName,
              birth_date: values.birthDate || null,
              address: values.address || null,
              city: values.city || null,
              postal_code: values.postalCode || null,
              country: values.country || "France",
              phone_number: values.phoneNumber || null,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) {
          console.error('Erreur inscription:', error);
          
          if (error.message.includes("User already registered")) {
            console.log('Utilisateur déjà existant');
            toast({
              title: "Compte existant",
              description: "Un compte existe déjà avec cet email. Connectez-vous.",
            });
            setIsSignUp(false);
            return;
          }
          
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: getErrorMessage(error),
          });
          return;
        }

        if (data?.user?.email) {
          try {
            console.log('Envoi email de vérification à:', data.user.email);
            const response = await supabase.functions.invoke('send-verification-email', {
              body: {
                to: data.user.email,
                confirmationUrl: `${window.location.origin}/auth/verify?next=${encodeURIComponent(returnTo)}`,
              },
            });

            if (response.error) {
              console.error('Erreur envoi email:', response.error);
              toast({
                variant: "destructive",
                title: "Email non envoyé",
                description: "L'email de vérification n'a pas pu être envoyé, mais votre compte a bien été créé. Vous recevrez un email de vérification par défaut.",
              });
            }
          } catch (emailError) {
            console.error('Erreur fonction email:', emailError);
          }
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        console.log('Tentative connexion avec:', values.email);
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error('Erreur connexion:', error);
          
          if (error.message.includes("Email not confirmed")) {
            toast({
              variant: "destructive",
              title: "Email non vérifié",
              description: "Veuillez vérifier votre email pour activer votre compte. Vérifiez vos spams si nécessaire.",
            });
            return;
          }
          
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: getErrorMessage(error),
          });
          return;
        }

        console.log('Connexion réussie');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
      }
    } catch (error) {
      console.error('Erreur auth:', error);
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
