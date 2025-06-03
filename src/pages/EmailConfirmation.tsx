
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { useEmailConfirmation } from '@/features/auth/hooks/useEmailConfirmation';

const EmailConfirmation = () => {
  const { isConfirming, confirmationResult } = useEmailConfirmation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {isConfirming ? (
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                ) : confirmationResult?.success ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
              
              <CardTitle>
                {isConfirming ? "Confirmation en cours..." : "Confirmation d'email"}
              </CardTitle>
              
              <CardDescription>
                {isConfirming 
                  ? "Vérification de votre lien de confirmation via Resend"
                  : confirmationResult?.success 
                    ? "Votre email a été confirmé avec succès"
                    : "Erreur lors de la confirmation"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isConfirming && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Traitement de votre confirmation d'email via Resend...
                  </AlertDescription>
                </Alert>
              )}
              
              {confirmationResult && (
                <Alert className={confirmationResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {confirmationResult.success ? (
                      <>
                        <Mail className="h-4 w-4 text-green-600" />
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </>
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <AlertDescription className={confirmationResult.success ? "text-green-800" : "text-red-800"}>
                    <div className="space-y-1">
                      <p>{confirmationResult.message}</p>
                      {confirmationResult.success && (
                        <p className="text-sm">Redirection vers la vérification SMS Twilio...</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {!isConfirming && !confirmationResult && (
                <Alert>
                  <AlertDescription>
                    Aucun token de confirmation détecté. Veuillez cliquer sur le lien dans votre email.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmailConfirmation;
