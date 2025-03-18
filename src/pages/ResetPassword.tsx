
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/utils/auth-errors";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifie si l'utilisateur a un accès valide via le hash d'URL
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setTokenError(true);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le lien de réinitialisation est invalide ou a expiré",
        });
        // Ne pas rediriger immédiatement, permettre à l'utilisateur de voir le message d'erreur
      } else if (!data.session) {
        console.log('No session found, checking URL hash...');
        
        // Si pas de session, vérifie si nous avons un access_token dans l'URL
        // Supabase met automatiquement le token dans l'URL hash après redirection
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        if (!accessToken || type !== 'recovery') {
          console.error('No valid recovery token in URL');
          setTokenError(true);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Le lien de réinitialisation est invalide ou a expiré",
          });
        } else {
          console.log('Found recovery token, setting session');
          // Définir la session avec le token de l'URL
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (sessionError) {
            console.error('Error setting session:', sessionError);
            setTokenError(true);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Le lien de réinitialisation est invalide ou a expiré",
            });
          }
        }
      } else {
        console.log('Valid session found');
      }
    };

    checkSession();
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to update password');
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password reset error:', error);
        const message = getErrorMessage(error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: message,
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour",
      });
      
      console.log('Password updated successfully, redirecting to login');
      // Déconnexion après réinitialisation du mot de passe
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du mot de passe",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Réinitialisation du mot de passe
          </CardTitle>
          <CardDescription className="text-center">
            {tokenError 
              ? "Le lien de réinitialisation est invalide ou a expiré"
              : "Entrez votre nouveau mot de passe"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenError ? (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Veuillez demander un nouveau lien de réinitialisation.
              </p>
              <Button 
                onClick={() => navigate("/auth")} 
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirmez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Traitement en cours..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
