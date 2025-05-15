
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthCardProps {
  redirectPath: string;
  onLoginSuccess?: () => void;
  onSignupSuccess?: () => void;
}

const AuthCard = ({ redirectPath, onLoginSuccess, onSignupSuccess }: AuthCardProps) => {
  return (
    <Card className="w-[450px] max-w-[95vw]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Authentification</CardTitle>
        <CardDescription>Entrez vos informations pour vous connecter ou créer un compte.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm 
              redirectPath={redirectPath}
              onLoginSuccess={onLoginSuccess}
            />
          </TabsContent>
          <TabsContent value="register">
            <SignupForm 
              redirectPath={redirectPath}
              onSignupSuccess={onSignupSuccess}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        {/* Footer content can be added here if needed */}
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
