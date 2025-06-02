
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginWith2FA } from "./LoginWith2FA";
import { RegisterForm } from "../RegisterForm";

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
    <div className="bg-white p-8 rounded-lg shadow-sm border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {activeTab === "login" ? "Connexion" : "Créer un compte"}
        </h2>
        <p className="text-gray-600 mt-2">
          {activeTab === "login" 
            ? "Connectez-vous à votre espace DirectivesPlus" 
            : "Rejoignez DirectivesPlus pour gérer vos directives anticipées"
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="register">Inscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4">
          <LoginWith2FA
            redirectPath={redirectPath}
            setRedirectInProgress={setRedirectInProgress}
            onForgotPassword={onForgotPassword}
          />
        </TabsContent>
        
        <TabsContent value="register" className="space-y-4">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
