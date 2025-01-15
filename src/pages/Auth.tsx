import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

const Auth = () => {
  const navigate = useNavigate();
  const { handleSubmit, isLoading } = useAuthState();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log('User signed in successfully, redirecting to home page');
        sessionStorage.setItem('showExplanationDialog', 'true');
        navigate("/");
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Button>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Créer un compte" : "Se connecter"}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isSignUp 
              ? "Inscrivez-vous pour accéder à vos directives anticipées"
              : "Connectez-vous pour accéder à vos directives anticipées"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            isSignUp={isSignUp}
            onSubmit={handleSubmit}
            onToggleMode={() => setIsSignUp(!isSignUp)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;