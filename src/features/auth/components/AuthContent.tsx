
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "../RegisterForm";
import { LoginForm } from "../LoginForm";

interface AuthContentProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const AuthContent = ({
  redirectPath,
  setRedirectInProgress,
  onForgotPassword,
}: AuthContentProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Connexion / Inscription</CardTitle>
        <CardDescription>
          Accédez à votre espace personnel DirectivesPlus
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="signup">S'inscrire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              redirectPath={redirectPath}
              setRedirectInProgress={setRedirectInProgress}
              onForgotPassword={onForgotPassword}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
