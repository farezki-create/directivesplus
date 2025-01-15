import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { Header } from "@/components/Header";

const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, isLoading } = useAuthState();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state change listener in Login page");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed in Login page:', event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log('User signed in successfully, redirecting to home page');
        navigate("/home");
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener in Login page");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Bienvenue sur DirectivesPlus
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
      </main>
    </div>
  );
};

export default Login;