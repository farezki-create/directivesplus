import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import { FormValues } from "@/components/auth/types";

type AuthCardProps = {
  isSignUp: boolean;
  onSubmit: (values: FormValues) => void;
  onToggleMode: () => void;
};

export const AuthCard = ({ isSignUp, onSubmit, onToggleMode }: AuthCardProps) => {
  return (
    <Card className="w-full">
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