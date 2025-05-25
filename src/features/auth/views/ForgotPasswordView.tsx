
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BackButton } from "../components/BackButton";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordView = ({ onBackToLogin }: ForgotPasswordViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Mot de passe oublié</CardTitle>
              <CardDescription>
                Entrez votre email pour recevoir un lien de réinitialisation
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ForgotPasswordForm onCancel={onBackToLogin} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
