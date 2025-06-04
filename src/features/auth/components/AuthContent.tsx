
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../LoginForm";
import { SimpleRegisterForm } from "./SimpleRegisterForm";

interface AuthContentProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const AuthContent = ({ redirectPath, setRedirectInProgress, onForgotPassword }: AuthContentProps) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleRegisterSuccess = () => {
    console.log("✅ Inscription terminée, basculement vers connexion");
    setActiveTab("login");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          DirectivesPlus
        </CardTitle>
        <CardDescription className="text-center">
          Accédez à votre espace sécurisé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <LoginForm
              redirectPath={redirectPath}
              setRedirectInProgress={setRedirectInProgress}
              onForgotPassword={onForgotPassword}
            />
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <SimpleRegisterForm onSuccess={handleRegisterSuccess} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
