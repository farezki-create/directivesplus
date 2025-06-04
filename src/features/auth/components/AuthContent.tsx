
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../LoginForm";
import { RegisterFormWithConfirmation } from "../RegisterFormWithConfirmation";
import { DebugSection } from "./DebugSection";

interface AuthContentProps {
  redirectPath?: string;
  setRedirectInProgress?: (inProgress: boolean) => void;
  onForgotPassword?: () => void;
}

export const AuthContent = ({ redirectPath, setRedirectInProgress, onForgotPassword }: AuthContentProps) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleLoginSuccess = () => {
    if (setRedirectInProgress) {
      setRedirectInProgress(true);
    }
  };

  const handleRegisterSuccess = () => {
    // La redirection est gérée dans RegisterFormWithConfirmation
  };

  return (
    <>
      <DebugSection />
      
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-directiveplus-800">
            Connexion / Inscription
          </CardTitle>
          <CardDescription>
            Accédez à votre espace sécurisé DirectivesPlus
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Se connecter</TabsTrigger>
              <TabsTrigger value="register">S'inscrire</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm 
                redirectPath={redirectPath || "/rediger"}
                setRedirectInProgress={setRedirectInProgress || (() => {})}
                onForgotPassword={onForgotPassword || (() => {})}
              />
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <RegisterFormWithConfirmation onSuccess={handleRegisterSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};
