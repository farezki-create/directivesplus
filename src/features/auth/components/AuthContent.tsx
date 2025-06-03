
import { useState } from "react";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Connexion / Inscription</CardTitle>
          <CardDescription>
            Accédez à votre espace personnel DirectivesPlus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <Shield className="h-8 w-8 mx-auto mb-2 text-directiveplus-600" />
          <CardTitle className="text-lg">Authentification sécurisée</CardTitle>
          <CardDescription>
            Connectez-vous avec un code de vérification envoyé par email ou SMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/auth/otp')}
          >
            <Shield className="mr-2 h-4 w-4" />
            Connexion par code OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
