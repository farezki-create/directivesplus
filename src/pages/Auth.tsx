import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (avatar) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(`${session.user.id}`, avatar);
          
          if (uploadError) {
            console.error('Error uploading avatar:', uploadError);
          }
        }
        navigate("/dashboard");
      }
      if (event === "SIGNED_OUT") {
        navigate("/");
        setErrorMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, avatar]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Email ou mot de passe incorrect.";
      case "Email not confirmed":
        return "Veuillez vérifier votre email pour confirmer votre compte.";
      case "Password should be at least 8 characters":
        return "Le mot de passe doit contenir au moins 8 caractères.";
      default:
        return error.message;
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Connexion</h1>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <Label htmlFor="avatar" className="block mb-2">Photo de profil</Label>
              {avatarPreview && (
                <div className="mb-4">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                </div>
              )}
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2"
              />
            </div>
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(var(--primary))',
                      brandAccent: 'rgb(var(--primary))',
                    },
                  },
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "Se connecter",
                    password_input_placeholder: "Minimum 8 caractères, 1 majuscule, 1 chiffre",
                  },
                  sign_up: {
                    email_label: "Email",
                    password_label: "Mot de passe",
                    button_label: "S'inscrire",
                    password_input_placeholder: "Minimum 8 caractères, 1 majuscule, 1 chiffre",
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;