
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanupAuthState } from "@/utils/authUtils";

interface LoginFormProps {
  redirectPath: string;
  onLoginSuccess?: () => void;
}

const LoginForm = ({ redirectPath, onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Clean up auth state before signing in to prevent conflicts
      cleanupAuthState();
      
      console.log("Attempting to sign in...");
      
      // First attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Pre-signin signout failed, continuing anyway");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      
      console.log("Sign in successful, redirecting to:", redirectPath);
      
      // Call onLoginSuccess callback if provided
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 0);
      }
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

  return (
    <form onSubmit={handleSignIn}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
          />
        </div>
        <div className="grid gap-1">
          <Input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}
          />
        </div>
        <Button disabled={loading} type="submit">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
