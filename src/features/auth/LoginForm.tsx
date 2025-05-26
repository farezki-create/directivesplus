
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginFormSchema, type LoginFormValues } from "./schemas";

interface LoginFormProps {
  onVerificationSent: (email: string) => void;
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onVerificationSent, redirectPath, setRedirectInProgress, onForgotPassword }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Sign in successful, user:", data.user.id);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        // Redirection simple sans forcer le rechargement
        setRedirectInProgress(true);
        
        // Petite attente pour que l'état d'auth se mette à jour
        setTimeout(() => {
          const finalRedirectPath = redirectPath === "/dashboard" ? "/rediger" : redirectPath;
          window.location.href = finalRedirectPath;
        }, 100);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email non vérifié",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
          variant: "destructive",
        });
        onVerificationSent(values.email);
      } else if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Identifiants incorrects",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: error.message || "Une erreur est survenue lors de la connexion.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-directiveplus-600 hover:underline"
            onClick={onForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        </div>
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </Form>
  );
};
