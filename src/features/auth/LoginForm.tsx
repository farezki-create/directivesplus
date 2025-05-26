
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, EyeIcon, EyeOffIcon, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginFormSchema, type LoginFormValues } from "./schemas";
import { checkAuthAttempt, resetAuthAttempts, detectSuspiciousLocation } from "@/utils/security/authSecurity";
import { clientRateLimiter } from "@/utils/security/rateLimiter";

interface LoginFormProps {
  onVerificationSent: (email: string) => void;
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onVerificationSent, redirectPath, setRedirectInProgress, onForgotPassword }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (values: LoginFormValues) => {
    // Rate limiting côté client (5 tentatives par 15 minutes)
    const rateLimitKey = `login_${values.email}`;
    if (!clientRateLimiter.checkLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      const remainingTime = clientRateLimiter.getRemainingTime(rateLimitKey);
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
      
      toast({
        title: "Trop de tentatives",
        description: `Veuillez patienter ${remainingMinutes} minute(s) avant de réessayer.`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    // Vérifier la protection anti-brute force serveur
    const bruteForceCheck = checkAuthAttempt(values.email, 'login');
    if (!bruteForceCheck.allowed) {
      toast({
        title: "Tentatives de connexion bloquées",
        description: `Trop de tentatives. Réessayez dans ${bruteForceCheck.lockoutMinutes} minutes.`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    // Afficher un avertissement si peu de tentatives restantes
    if (bruteForceCheck.remainingAttempts <= 2) {
      setSecurityWarning(`Attention: ${bruteForceCheck.remainingAttempts} tentative(s) restante(s) avant blocage temporaire.`);
    }

    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      
      // Vérifier la géolocalisation suspecte
      const suspiciousLocation = await detectSuspiciousLocation();
      if (suspiciousLocation) {
        toast({
          title: "Connexion depuis un nouveau lieu",
          description: "Nous avons détecté une connexion depuis un nouveau lieu. Vérifiez votre email pour confirmation.",
          variant: "default",
          duration: 6000
        });
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Messages d'erreur génériques pour éviter l'énumération d'utilisateurs
        let errorMessage = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Votre email n'a pas encore été vérifié. Consultez votre boîte de réception.";
          onVerificationSent(values.email);
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Trop de tentatives de connexion. Veuillez patienter avant de réessayer.";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
          duration: 6000
        });
        
        throw error;
      }
      
      if (data.user) {
        console.log("Sign in successful, user:", data.user.id);
        
        // Réinitialiser les compteurs après succès
        resetAuthAttempts(values.email, 'login');
        setSecurityWarning(null);
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        setRedirectInProgress(true);
        
        // Redirection avec délai pour permettre la propagation de l'état
        setTimeout(() => {
          const finalRedirectPath = redirectPath === "/dashboard" ? "/rediger" : redirectPath;
          console.log("Redirecting to:", finalRedirectPath);
          window.location.href = finalRedirectPath;
        }, 500);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      // L'erreur a déjà été gérée dans le bloc if (error) ci-dessus
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
        {/* Avertissement de sécurité */}
        {securityWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{securityWarning}</AlertDescription>
          </Alert>
        )}
        
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
