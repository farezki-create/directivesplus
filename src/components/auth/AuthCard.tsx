
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthCardProps {
  redirectPath: string;
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
}

const AuthCard = ({ redirectPath, onLoginSuccess, onSignupSuccess }: AuthCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Authentification</CardTitle>
        <CardDescription>Entrez votre email et mot de passe pour vous connecter.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs defaultValue="login" className="w-[300px]">
          <TabsList>
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm 
              email={email} 
              setEmail={setEmail} 
              password={password} 
              setPassword={setPassword}
              redirectPath={redirectPath}
            />
          </TabsContent>
          <TabsContent value="register">
            <SignupForm 
              email={email} 
              setEmail={setEmail} 
              password={password} 
              setPassword={setPassword}
              redirectPath={redirectPath}
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
