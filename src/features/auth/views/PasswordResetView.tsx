
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BackButton } from "../components/BackButton";
import { PasswordResetForm } from "../PasswordResetForm";

interface PasswordResetViewProps {
  resetToken: string;
  onSuccess: () => void;
}

export const PasswordResetView = ({ resetToken, onSuccess }: PasswordResetViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Nouveau mot de passe</CardTitle>
              <CardDescription>
                Choisissez un nouveau mot de passe pour votre compte
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <PasswordResetForm 
                token={resetToken} 
                onSuccess={onSuccess} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
