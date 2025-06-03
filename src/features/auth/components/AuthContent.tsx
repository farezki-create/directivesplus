
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../LoginForm";
import { RegisterFormWithSupabase } from "../RegisterFormWithSupabase";

interface AuthContentProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onForgotPassword: () => void;
}

export const AuthContent = ({ 
  redirectPath, 
  setRedirectInProgress, 
  onForgotPassword 
}: AuthContentProps) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900">
          DirectivesPlus
        </CardTitle>
        <CardDescription className="text-gray-600">
          Accédez à votre espace personnel sécurisé
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm
              redirectPath={redirectPath}
              setRedirectInProgress={setRedirectInProgress}
              onForgotPassword={onForgotPassword}
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterFormWithSupabase 
              onSuccess={() => {
                console.log("✅ Inscription terminée avec succès");
              }} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
