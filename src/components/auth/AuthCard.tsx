import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import type { FormValues } from "@/components/AuthForm";

type AuthCardProps = {
  isSignUp: boolean;
  isLoading: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  onToggleMode: () => void;
};

export const AuthCard = ({ 
  isSignUp, 
  isLoading, 
  onSubmit, 
  onToggleMode 
}: AuthCardProps) => {
  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-2xl font-bold">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </CardTitle>
        <CardDescription className="text-base">
          {isSignUp 
            ? "Inscrivez-vous pour accéder à vos directives anticipées"
            : "Connectez-vous pour accéder à vos directives anticipées"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          isSignUp={isSignUp}
          onSubmit={onSubmit}
          onToggleMode={onToggleMode}
        />
      </CardContent>
    </Card>
  );
};