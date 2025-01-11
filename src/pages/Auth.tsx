import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { getErrorMessage } from "@/utils/auth-errors";
import type { z } from "zod";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
      if (event === "SIGNED_OUT") {
        navigate("/");
        setErrorMessage("");
      }
      if (event === "USER_UPDATED" || event === "INITIAL_SESSION") {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.log('Auth error:', error);
          const translatedError = getErrorMessage(error);
          setErrorMessage(translatedError);
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: translatedError,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSubmit = async (values: z.AnyZodObject) => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) {
          console.log('Signup error:', error);
          const message = getErrorMessage(error);
          setErrorMessage(message);
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: message,
          });
          if (error.message.includes("already registered")) {
            setIsSignUp(false);
          }
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
          console.log('Signin error:', error);
          const message = getErrorMessage(error);
          setErrorMessage(message);
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: message,
          });
          throw error;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof AuthApiError) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: message,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            {isSignUp ? "Inscription" : "Connexion"}
          </h1>
          
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <AuthForm
              isSignUp={isSignUp}
              onSubmit={handleSubmit}
              onToggleMode={() => setIsSignUp(!isSignUp)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;