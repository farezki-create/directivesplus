
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, Mail, UserPlus, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PasswordAuthProps {
  onSuccess?: () => void;
}

const PasswordAuth: React.FC<PasswordAuthProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let msg = "Identifiants incorrects.";
        if (error.message.includes("Invalid login")) {
          msg = "Email ou mot de passe incorrect.";
        } else if (error.message.includes("Email not confirmed")) {
          msg = "Veuillez confirmer votre email avant de vous connecter.";
        } else if (error.status === 429) {
          msg = "Trop de tentatives. Patientez quelques minutes.";
        }
        toast({ title: "Erreur de connexion", description: msg, variant: "destructive" });
        return;
      }

      if (data.user && data.session) {
        toast({ title: "Connexion réussie !", description: "Redirection en cours..." });
        setTimeout(() => { window.location.href = '/profile'; }, 1000);
        onSuccess?.();
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (password.length < 8) {
      toast({ title: "Mot de passe trop court", description: "Le mot de passe doit contenir au moins 8 caractères.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        let msg = "Impossible de créer le compte.";
        if (error.message.includes("already registered")) {
          msg = "Un compte existe déjà avec cet email. Essayez de vous connecter.";
        } else if (error.status === 429) {
          msg = "Trop de tentatives. Patientez quelques minutes.";
        } else if (error.message.includes("password")) {
          msg = "Le mot de passe ne respecte pas les critères de sécurité.";
        }
        toast({ title: "Erreur d'inscription", description: msg, variant: "destructive" });
        return;
      }

      if (data.user && !data.session) {
        toast({
          title: "Inscription réussie !",
          description: "Un email de confirmation vous a été envoyé. Vérifiez votre boîte de réception.",
        });
      } else if (data.session) {
        toast({ title: "Compte créé et connecté !", description: "Redirection en cours..." });
        setTimeout(() => { window.location.href = '/profile'; }, 1000);
        onSuccess?.();
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({ title: "Email requis", description: "Saisissez votre email pour réinitialiser votre mot de passe.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({ title: "Erreur", description: "Impossible d'envoyer l'email de réinitialisation.", variant: "destructive" });
      } else {
        toast({
          title: "Email envoyé",
          description: "Consultez votre boîte email pour réinitialiser votre mot de passe.",
        });
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5" />
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Connectez-vous avec votre email et mot de passe'
            : 'Créez votre compte DirectivesPlus'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw-email">Adresse email</Label>
            <Input
              id="pw-email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pw-password">Mot de passe</Label>
            <Input
              id="pw-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="pw-confirm">Confirmer le mot de passe</Label>
              <Input
                id="pw-confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          )}

          {mode === 'signup' && (
            <Alert>
              <AlertDescription className="text-xs text-muted-foreground">
                Le mot de passe doit contenir au moins 8 caractères.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Créer mon compte
              </>
            )}
          </Button>
        </form>

        {mode === 'login' && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Mot de passe oublié ?
          </button>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-sm text-primary hover:underline"
          >
            {mode === 'login'
              ? "Pas encore de compte ? S'inscrire"
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordAuth;
