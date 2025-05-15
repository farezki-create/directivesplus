
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanupAuthState } from "@/utils/authUtils";

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  redirectPath: string;
}

const SignupForm = ({ email, setEmail, password, setPassword, redirectPath }: SignupFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Clean up auth state before signing up
      cleanupAuthState();
      
      console.log("Attempting to sign up...");
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
      
      // Wait briefly then redirect
      setTimeout(() => {
        console.log("Sign up successful, redirecting to:", redirectPath);
        // Navigate is handled by the parent component
      }, 1500);
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

  return (
    <form onSubmit={handleSignUp}>
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
          {loading ? "S'inscrire..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
