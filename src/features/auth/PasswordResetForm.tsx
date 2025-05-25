
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordResetSchema = z.object({
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  passwordConfirm: z.string()
}).refine(data => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

type PasswordResetValues = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  token: string;
  onSuccess: () => void;
}

export const PasswordResetForm = ({ token, onSuccess }: PasswordResetFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionEstablished, setSessionEstablished] = useState(false);

  const form = useForm<PasswordResetValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  // Establish session with the reset token
  useEffect(() => {
    const establishSession = async () => {
      try {
        console.log("Establishing session with token:", token.substring(0, 10) + "...");
        
        // Try to set the session using the token
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Sometimes the same token is used for both
        });

        if (error) {
          console.error("Error setting session:", error);
          toast({
            title: "Lien invalide",
            description: "Le lien de réinitialisation est invalide ou a expiré.",
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
            description: "Impossible d'établir la session. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in establishSession:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation.",
          variant: "destructive",
        });
      }
    };

    if (token) {
      establishSession();
    }
  }, [token]);

  const handleSubmit = async (values: PasswordResetValues) => {
    if (!sessionEstablished) {
      toast({
        title: "Session non établie",
        description: "Veuillez attendre que la session soit établie.",
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
        throw error;
      }
      
      console.log("Password updated successfully");
      
      toast({
        title: "Mot de passe réinitialisé",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
      
      // Sign out to clear the session and force re-login
      await supabase.auth.signOut();
      
      onSuccess();
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erreur lors de la réinitialisation",
        description: error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!sessionEstablished) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">Vérification du lien de réinitialisation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Réinitialisation du mot de passe</h3>
        <p className="text-gray-600 text-sm">
          Veuillez entrer votre nouveau mot de passe
        </p>
      </div>
      
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
          
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
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
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
