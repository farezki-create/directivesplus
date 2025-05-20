
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail } from "lucide-react";

interface VerificationAlertProps {
  email: string;
}

export const VerificationAlert = ({ email }: VerificationAlertProps) => {
  const [loading, setLoading] = useState(false);

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Un nouvel email de vérification a été envoyé.",
      });
    } catch (error: any) {
      console.error("Email resend error:", error);
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <Mail className="h-4 w-4 text-amber-800" />
      <AlertTitle className="text-amber-800 font-medium">Vérification requise</AlertTitle>
      <AlertDescription className="text-amber-800">
        <p>Un email de vérification a été envoyé à <strong>{email}</strong>.</p>
        <p className="mt-2">Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.</p>
        <p className="mt-2 text-xs">Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam ou essayez de vous connecter directement - en développement, la vérification par email peut être désactivée.</p>
        <Button 
          variant="outline" 
          className="mt-2 bg-white border-amber-300 text-amber-800 hover:bg-amber-100 flex items-center gap-2" 
          onClick={resendVerificationEmail}
          disabled={loading}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Envoi en cours..." : "Renvoyer l'email"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
