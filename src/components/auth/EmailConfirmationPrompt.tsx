
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmailConfirmationPromptProps {
  email: string;
  onRequestOTPCode: () => void;
  isLoadingOTP?: boolean;
}

export const EmailConfirmationPrompt: React.FC<EmailConfirmationPromptProps> = ({
  email,
  onRequestOTPCode,
  isLoadingOTP = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Confirmation par email
          </CardTitle>
          <CardDescription className="text-gray-600">
            Votre compte a été créé avec succès
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-2">
                <p className="font-medium">Email de confirmation envoyé à :</p>
                <p className="text-sm bg-white px-2 py-1 rounded border">{email}</p>
                <p className="text-xs">Vérifiez vos spams si nécessaire.</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Vous pouvez aussi demander un code de connexion temporaire :
              </p>
              
              <Button 
                onClick={onRequestOTPCode}
                disabled={isLoadingOTP}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
              >
                {isLoadingOTP ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Recevoir un code de connexion
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Problème avec votre email ? Contactez le support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
