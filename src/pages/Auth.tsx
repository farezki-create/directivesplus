
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

// Helper function to clean up Supabase auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  
  // Get the redirect path from location state or default to /rediger
  const from = location.state?.from || "/rediger";

  // Redirect if already authenticated, but only after the auth state has loaded
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("Auth page: Already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Try to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      // Now sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      
      console.log("Sign in successful, redirecting to:", from);
      // Use replace: true to prevent back button from going to login again
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting to sign up...");
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Try to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      // Now sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
      
      // Use replace: true to prevent back button from going to login again
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Don't render auth page if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="grid h-screen place-items-center">
        <Card className="w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Authentification</CardTitle>
            <CardDescription>Entrez votre email et mot de passe pour vous connecter.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Tabs defaultValue="login" className="w-[300px]">
              <TabsList>
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSignIn}>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    <div className="grid gap-1">
                      <Input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                    </div>
                    <Button disabled={loading} type="submit">
                      {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    <div className="grid gap-1">
                      <Input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                    </div>
                    <Button disabled={loading} type="submit">
                      {loading ? "S'inscrire..." : "S'inscrire"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {/* Footer content can be added here if needed */}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Auth;
