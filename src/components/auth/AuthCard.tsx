import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthForm } from "@/components/AuthForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { FormValues } from "@/components/AuthForm";

type AuthCardProps = {
  isSignUp: boolean;
  isLoading: boolean;
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  onSubmit: (values: FormValues) => Promise<void>;
  onToggleMode: () => void;
};

export const AuthCard = ({ 
  isSignUp, 
  isLoading, 
  onSocialLogin, 
  onSubmit, 
  onToggleMode 
}: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {isSignUp 
            ? "Inscrivez-vous pour accéder à vos directives anticipées"
            : "Connectez-vous pour accéder à vos directives anticipées"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialLoginButtons 
          onSocialLogin={onSocialLogin}
          isLoading={isLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continuez avec
            </span>
          </div>
        </div>

        <AuthForm
          isSignUp={isSignUp}
          onSubmit={onSubmit}
          onToggleMode={onToggleMode}
        />
      </CardContent>
    </Card>
  );
};