
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export const ForgotPasswordForm = ({ onCancel }: ForgotPasswordFormProps) => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Email envoyé",
        description: "Consultez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erreur lors de l'envoi de l'email",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">Email envoyé !</h3>
        <p className="text-gray-600">
          Consultez votre boîte de réception pour réinitialiser votre mot de passe.
        </p>
        <Button onClick={onCancel} className="w-full">
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Réinitialisation du mot de passe</h3>
        <p className="text-gray-600 text-sm">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="w-1/2"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="w-1/2" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
