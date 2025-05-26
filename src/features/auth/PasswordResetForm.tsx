
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, EyeIcon, EyeOffIcon, Shield, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPasswordSchema, type ResetPasswordValues } from "./schemas";
import PasswordStrengthIndicator from "@/components/ui/password-strength-indicator";
import { validatePasswordSecurity, validateTokenIntegrity } from "@/utils/security/passwordSecurity";
import { checkAuthAttempt, resetAuthAttempts } from "@/utils/security/authSecurity";

interface PasswordResetFormProps {
  token: string;
  onSuccess: () => void;
}

export const PasswordResetForm = ({ token, onSuccess }: PasswordResetFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionEstablished, setSessionEstablished] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password") || "";
  const passwordValidation = validatePasswordSecurity(password);

  // Valider le token et établir la session
  useEffect(() => {
    const establishSession = async () => {
      try {
        console.log("Validating reset token...");
        
        // Vérifier l'intégrité du token
        if (!validateTokenIntegrity(token)) {
          console.error("Invalid token format");
          toast({
            title: "Lien invalide",
            description: "Le lien de réinitialisation est malformé ou corrompu.",
            variant: "destructive",
          });
          return;
        }
        
        setTokenValid(true);
        
        // Vérifier la protection anti-brute force pour la réinitialisation
        const bruteForceCheck = checkAuthAttempt(token.substring(0, 20), 'password_reset');
        if (!bruteForceCheck.allowed) {
          toast({
            title: "Réinitialisation bloquée",
            description: `Trop de tentatives. Réessayez dans ${bruteForceCheck.lockoutMinutes} minutes.`,
            variant: "destructive",
            duration: 8000
          });
          return;
        }

        if (bruteForceCheck.remainingAttempts <= 2) {
          setSecurityWarning(`Attention: ${bruteForceCheck.remainingAttempts} tentative(s) restante(s) avant blocage.`);
        }
        
        console.log("Establishing session with token:", token.substring(0, 10) + "...");
        
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token,
        });

        if (error) {
          console.error("Error setting session:", error);
          toast({
            title: "Lien expiré",
            description: "Le lien de réinitialisation a expiré. Demandez un nouveau lien.",
            variant: "destructive",
          });
          return;
        }

        if (data.session) {
          console.log("Session established successfully");
          setSessionEstablished(true);
        } else {
          console.error("No session returned from setSession");
          toast({
            title: "Erreur de session",
            description: "Impossible d'établir la session. Le lien peut être invalide.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in establishSession:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la validation du lien.",
          variant: "destructive",
        });
      }
    };

    if (token) {
      establishSession();
    }
  }, [token]);

  const handleSubmit = async (values: ResetPasswordValues) => {
    if (!sessionEstablished || !tokenValid) {
      toast({
        title: "Session non établie",
        description: "Veuillez attendre que la session soit établie.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValidation.isValid) {
      toast({
        title: "Mot de passe non sécurisé",
        description: "Veuillez corriger les erreurs dans votre mot de passe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Updating password...");
      
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });

      if (error) {
        console.error("Error updating password:", error);
        
        let errorMessage = "Une erreur est survenue lors de la réinitialisation du mot de passe.";
        if (error.message.includes("session_not_found")) {
          errorMessage = "Session expirée. Veuillez demander un nouveau lien de réinitialisation.";
        }
        
        toast({
          title: "Erreur lors de la réinitialisation",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw error;
      }
      
      console.log("Password updated successfully");
      
      // Réinitialiser le compteur après succès
      resetAuthAttempts(token.substring(0, 20), 'password_reset');
      
      toast({
        title: "Mot de passe réinitialisé",
        description: "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
      });
      
      // Déconnecter pour forcer une nouvelle connexion sécurisée
      await supabase.auth.signOut();
      
      onSuccess();
    } catch (error: any) {
      console.error("Error resetting password:", error);
      // L'erreur a déjà été gérée dans le bloc if (error) ci-dessus
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">Validation du lien de réinitialisation...</p>
      </div>
    );
  }

  if (!sessionEstablished) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium">Réinitialisation du mot de passe</h3>
        <p className="text-gray-600 text-sm">
          Créez un nouveau mot de passe sécurisé pour votre compte
        </p>
      </div>

      {/* Avertissement de sécurité */}
      {securityWarning && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{securityWarning}</AlertDescription>
        </Alert>
      )}

      {/* Conseils de sécurité */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Sécurité renforcée :</strong> Votre nouveau mot de passe doit être unique et sécurisé.
          Ne réutilisez pas un ancien mot de passe.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••••••" 
                      {...field}
                      className={`pr-10 ${
                        password && !passwordValidation.isValid ? 'border-red-500' : 
                        password && passwordValidation.score >= 70 ? 'border-green-500' : ''
                      }`}
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
                
                {/* Indicateur de force du mot de passe */}
                {password && (
                  <PasswordStrengthIndicator 
                    validation={passwordValidation} 
                    className="mt-2"
                  />
                )}
                
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••••••" 
                      {...field} 
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !passwordValidation.isValid}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </Form>
      
      {/* Rappel de sécurité */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h4 className="text-xs font-medium text-blue-800 mb-1">
          Après la réinitialisation :
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Vous serez déconnecté automatiquement</li>
          <li>• Connectez-vous avec votre nouveau mot de passe</li>
          <li>• Conservez ce mot de passe en lieu sûr</li>
        </ul>
      </div>
    </div>
  );
};
