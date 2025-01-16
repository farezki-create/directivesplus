import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/utils/auth-errors";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, message: "Au moins 8 caractères" },
      { regex: /[A-Z]/, message: "Au moins une lettre majuscule" },
      { regex: /[a-z]/, message: "Au moins une lettre minuscule" },
      { regex: /[0-9]/, message: "Au moins un chiffre" },
      { regex: /[^A-Za-z0-9]/, message: "Au moins un caractère spécial" },
    ];

    const failedRequirements = requirements.filter(req => !req.regex.test(password));
    return failedRequirements.length ? failedRequirements[0].message : null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast({
        variant: "destructive",
        title: "Mot de passe invalide",
        description: passwordError,
      });
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      setIsLoading(false);
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
        return;
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour",
      });
      
      console.log('Password updated successfully, redirecting to login');
      navigate("/auth");
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du mot de passe",
      });
    } finally {
      setIsLoading(false);
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
            Entrez votre nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Au moins 8 caractères</li>
              <li>• Au moins une lettre majuscule</li>
              <li>• Au moins une lettre minuscule</li>
              <li>• Au moins un chiffre</li>
              <li>• Au moins un caractère spécial (!@#$%^&*)</li>
            </ul>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;