
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import { FormValues } from "@/components/auth/types";
import { useLanguage } from "@/hooks/useLanguage";

type AuthCardProps = {
  isSignUp: boolean;
  onSubmit: (values: FormValues) => void;
  onToggleMode: () => void;
};

export const AuthCard = ({ isSignUp, onSubmit, onToggleMode }: AuthCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isSignUp ? t('createAccount') : t('signIn')}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {isSignUp ? t('signUpDesc') : t('loginDesc')}
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
