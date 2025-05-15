
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanupAuthState } from "@/utils/authUtils";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  redirectPath: string;
}

const LoginForm = ({ email, setEmail, password, setPassword, redirectPath }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Clean up auth state before signing in to prevent conflicts
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      console.log("Attempting to sign in...");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      
      console.log("Sign in successful, redirecting to:", redirectPath);
      // Navigate is handled by the parent component
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
