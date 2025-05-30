
import React from 'react';
import { SmsForm } from '@/components/sms/SmsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const SmsManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestion SMS</h2>
        <p className="text-muted-foreground">
          Envoyez des SMS via Brevo
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Les SMS sont envoyés via l'API Brevo. Assurez-vous d'avoir configuré votre compte Brevo 
          et d'avoir suffisamment de crédits SMS.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <SmsForm />
        
        <Card>
          <CardHeader>
            <CardTitle>Informations importantes</CardTitle>
            <CardDescription>
              À propos de l'envoi de SMS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Format des numéros</h4>
              <p className="text-sm text-gray-600">
                Les numéros doivent être au format français (06, 07, etc.). 
                Le préfixe international +33 est ajouté automatiquement.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Limite de caractères</h4>
              <p className="text-sm text-gray-600">
                Maximum 160 caractères par SMS. Les messages plus longs 
                seront tronqués.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Expéditeur</h4>
              <p className="text-sm text-gray-600">
                L'expéditeur peut être personnalisé (11 caractères max). 
                Par défaut : "DirectivesPlus".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
